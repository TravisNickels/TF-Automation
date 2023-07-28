module.exports = async ({github, context}) => {

  console.log(context);

  const projectV2Data = await getProjectV2Data(170);
  const statusFieldId = getProjectV2FieldId('Status');
  const statusOptionId = getProjectV2SingleSelectOptionId('Status', 'Squad Work');
  const projectId = projectV2Data.user.projectV2.id;
  const projectTitle = projectV2Data.user.projectV2.title;
  const eventName = context.eventName;

  let nodeId = undefined;
  let labels = undefined;
  let itemTitle = undefined;

  if (context.payload.issue !== undefined){
    nodeId = context.payload.issue.node_id;
    labels = context.payload.issue.labels;
    itemTitle = context.payload.issue.title;
    const itemData = await getProjectV2ItemFromNodeId(nodeId, projectId, eventName);

    if (itemTitle.startsWith("Action items:"))
    {
      console.log("Found an action item");
      console.log("ProjectId: " + projectId);
      console.log("itemData.id: " + itemData.id);
      console.log("statusFieldId: " + statusFieldId);
      console.log("statusOptionId: " + statusOptionId);

      const data = updateStatus(projectId, itemData.id, statusFieldId, statusOptionId);
      console.log("-- Updated project item --");
      console.log("Item title: " + data.updateProjectV2ItemFieldValue.projectV2Item.fieldValueByName.text);
      console.log("Item ID: " + itemData.id);
      console.log('Project Title: ' + projectTitle);
      console.log('Project ID: ' + projectId);
      console.log('Status: ' + "Squad Work");
      console.log('Status Field ID: ' + statusFieldId);
    }
  }

  async function getProjectV2Data(projectNumber){
    const query = `query($owner: String!, $projectNum: Int!){
      user(login:$owner) {
        projectV2(number:$projectNum) {
          id
          title
          fields(first: 100){
            nodes {
              ... on ProjectV2Field {
                name
                id
              }
              ... on ProjectV2SingleSelectField {
                name
                id
                options{
                  name
                  id
                }
              }
            }
          }
        }
      }
    }`;
    const variables = {
      owner: context.repo.owner,
      projectNum: projectNumber,
    };

    return await github.graphql(query, variables);
  }

  async function updateStatus(projectId, itemId, fieldId, value){
    const mutation = `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!){
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: {singleSelectOptionId: $value}
      }){
        projectV2Item {
          id
          fieldValueByName(name: "Title"){
            ... on ProjectV2ItemFieldTextValue {
              text
            }
          }
        }
      }
    }`;
    const variables = {
      projectId: projectId,
      itemId: itemId,
      fieldId: fieldId,
      value: value
    };

    return await github.graphql(mutation, variables);
  }

  async function getProjectV2ItemFromNodeId(nodeId, projectId, eventName){
    switch(eventName){
      case 'issues':
        eventName = 'Issue'
        break;
      case 'pull_request':
        eventName = 'PullRequest'
        break;
    }
    const query = `query($nodeId: ID!) {
      node(id: $nodeId) {
        ... on ${eventName} {
          projectItems(first: 100) {
            ... on ProjectV2ItemConnection {
              nodes {
                ... on ProjectV2Item {
                  id
                  project {
                    ... on ProjectV2 {
                      id, title, number
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const variables = {
      nodeId: nodeId
    };

    let data = await github.graphql(query, variables);

    for (const projectItem of data.node.projectItems.nodes){
      if (projectItem.project.id === projectId){
        return projectItem;
      }
    }
  }

  function getProjectV2FieldId(name) {
    for (const field of projectV2Data.user.projectV2.fields.nodes){
      if (field.name === name){
        return field.id;
      }
    }
  }

  function getProjectV2SingleSelectOptionId(fieldName, optionName) {
    for (const field of projectV2Data.user.projectV2.fields.nodes){
      if (field.name === fieldName){
        for (const option of field.options) {
          if (option.name == optionName){
            return option.id;
          }
        }
      }
    }
  }

  return;
}