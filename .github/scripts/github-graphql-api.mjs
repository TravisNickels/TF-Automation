/**
 * @param {int} projectNumber - The number of the GitHub projectV2 (e.g. 3)
 * @param {string} owner - The owner of the repo
 * @param {context} github - The hydrated Octokit github client 
 * @returns ProjectV2 field information object based on the graphQL query format.  For example:
 * - {variable}.user.projectV2.id
 * - {variable}.user.projectV2.title
 * - {variable}.user.projectV2.fields.nodes[index].name
 * - {variable}.user.projectV2.fields.nodes[index].id
 * - {variable}.user.projectV2.fields.nodes[index].options[index].name
 * - {variable}.user.projectV2.fields.nodes[index].options[index].id
 */
export const getProjectV2Data = async (projectNumber, owner, github) => {
  const query = `query($owner: String!, $projectNumber: Int!){
    user(login:$owner) {
      projectV2(number:$projectNumber) {
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
    owner: owner,
    projectNumber: projectNumber,
  };

  // Used for testing
  getProjectV2Data.query = query;
  getProjectV2Data.variables = variables;

  return await github.graphql(query, variables);
}

/**
 * @param {string} projectId - The node_id of the GitHub projectV2
 * @param {string} itemId - The node_id of the projectV2 item
 * @param {string} fieldId - The node_id of the projectV2 status field
 * @param {string} value  - The id of the single select status option
 * @param {context} github - The hydrated Octokit github client
 * @returns The title of the projectV2 item that had the status updated
 * - updateProjectV2ItemFieldValue.projectV2Item.fieldValueByName.text
 */
export const updateStatus = async (projectId, itemId, fieldId, value, github) => {
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

/**
 * 
 * @param {*} nodeId - The node_id of the issue or pull request
 * @param {*} projectId - The node_id of the projectV2
 * @param {*} eventName - The event name from the action context
 * @param {*} github - The hydrated Octokit github client
 * @returns Project item id and the corresponding projectV2 id, title, and number
 * - {variable}.id
 * - {variable}.project.id
 * - {variable}.project.title
 * - {variable}.project.number
 */
export const getProjectV2ItemFromNodeId = async (nodeId, projectId, eventName, github) => {
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

  const data = await github.graphql(query, variables);

  // Find and return the correct project item information from the projectId provided
  for (const projectItem of data.node.projectItems.nodes){
    if (projectItem.project.id === projectId){
      return await projectItem;
    }
  }
}