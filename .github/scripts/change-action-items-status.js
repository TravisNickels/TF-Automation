module.exports = async ({github, context}) => {

  //const statusFieldId = getProjectV2FieldId('Status');
  //console.log(github);
  //console.log(context);

  const issueTitle = context.payload.issues.title;

  if (issueTitle.startsWith("Action items:"))
  {
    console.log("Found an action item");
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

  /* function getProjectV2FieldId(name) {
    for (const field of queryResult.user.projectV2.fields.nodes){
      if (field.name === name){
        return field.id;
      }
    }
  } */

  return;
}