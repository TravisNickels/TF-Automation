module.exports = async ({github, context}) => {

  const queryResult = await getProjectV2Fields(170);
  const statusFieldId = getProjectV2FieldId('Status');
  //console.log(github);
  //console.log(context);
  //console.log(context.payload.issue.title);
  //console.log("context.payload: " + context.payload);
  //console.log("context.issue: " + context.issue);
  //console.log("context.issue.title: " + context.issue.title);

  const issueTitle = context.payload.issue.title;

  if (issueTitle.startsWith("Action items:"))
  {
    console.log("Found an action item");
  }

  async function getProjectV2Fields(projectNumber){
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

  /* async function updateStatus(projectId, itemId, fieldId, value){
    const mutation = `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: Date!){
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: {date: $value}
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
  } */

  function getProjectV2FieldId(name) {
    for (const field of queryResult.user.projectV2.fields.nodes){
      if (field.name === name){
        return field.id;
      }
    }
  }

  return;
}