import * as githubGraphQLApi from "./github-graphql-api.mjs";
//module.exports
export default async ({github, context}) => {
  const owner = context.repo.owner;
  const projectV2Data = await githubGraphQLApi.getProjectV2Data(170, owner, github);
  const projectId = projectV2Data.user.projectV2.id;
  const projectTitle = projectV2Data.user.projectV2.title;
  const statusFieldId = getProjectV2FieldId('Status');
  const statusOptionId = getProjectV2SingleSelectOptionId('Status', 'Squad Work');
  const eventName = context.eventName;

  if (context.payload.issue !== undefined){
    const nodeId = context.payload.issue.node_id;
    const itemTitle = context.payload.issue.title;
    const itemData = await githubGraphQLApi.getProjectV2ItemFromNodeId(nodeId, projectId, eventName, github);

    if (itemTitle.startsWith("Action items:"))
    {
      const data = await githubGraphQLApi.updateStatus(projectId, itemData.id, statusFieldId, statusOptionId, github);
      console.log("-- Updated action item project item --");
      console.log("Item title: " + data.updateProjectV2ItemFieldValue.projectV2Item.fieldValueByName.text);
      console.log("Item ID: " + itemData.id);
      console.log('Project Title: ' + projectTitle);
      console.log('Project ID: ' + projectId);
      console.log('Status: ' + "Squad Work");
      console.log('Status Field ID: ' + statusFieldId);
      console.log("statusOptionId: " + statusOptionId);
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