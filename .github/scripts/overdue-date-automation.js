module.exports = async ({github, context}) => {

  const queryResult = await getProjectV2ItemsAndFields(170);
  const overdueOnFieldId = getProjectV2FieldId('Overdue on');

  for (const projectItem of queryResult.user.projectV2.items.nodes){
    let isSquadWork = false;
    let isOverdueOnSet = false;

    for (const fieldValue of projectItem.fieldValues.nodes) {
      if (fieldValue.field !== undefined){
        if (fieldValue.field.name === 'Status'){
          if (fieldValue.name === 'Squad Work'){
            isSquadWork = true;
          }
        }else if (fieldValue.field.name === 'Overdue on'){
          isOverdueOnSet = true;
        }
      }
    }

    if (isSquadWork && !isOverdueOnSet){
      let OverdueOnDate = new Date(projectItem.updatedAt);
      OverdueOnDate.setDate(OverdueOnDate.getDate() + 14);

      const projectId = queryResult.user.projectV2.id;
      const projectTitle = queryResult.user.projectV2.title;
      const itemId = projectItem.id;

      const data = await updateOverdueOnDate(projectId, itemId, overdueOnFieldId, OverdueOnDate.toISOString());
      console.log("-- Updated project item --");
      console.log("Item title: " + data.updateProjectV2ItemFieldValue.projectV2Item.fieldValueByName.text);
      console.log("Item ID: " + itemId);
      console.log('Project Title: ' + projectTitle);
      console.log('Project ID: ' + projectId);
      console.log('New OverdueOn: ' + OverdueOnDate.toISOString());
      console.log('Overdue On Field ID: ' + overdueOnFieldId);
    }
  }

  async function getProjectV2ItemsAndFields(projectNumber){
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
          items(first: 100) {
            nodes {
              id
              updatedAt
              fieldValues(first: 100) {
                nodes {
                  ... on ProjectV2ItemFieldTextValue {
                    id
                    text
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    id
                    name
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldDateValue {
                    id
                    date
                    field {
                      ... on ProjectV2Field {
                        name
                      }
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
      owner: context.repo.owner,
      projectNum: projectNumber,
    };

    return await github.graphql(query, variables);
  }

  async function updateOverdueOnDate(projectId, itemId, fieldId, value){
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
  }

  function getProjectV2FieldId(name) {
    for (const field of queryResult.user.projectV2.fields.nodes){
      if (field.name === name){
        return field.id;
      }
    }
  }

  return;
}