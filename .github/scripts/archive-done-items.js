module.exports = async ({github, context}) => {
  //console.log(github);
  //console.log(context);
  const projectData = await getProjectV2(170);
  const projectId = projectData.user.projectV2.id;
  const projectTitle = projectData.user.projectV2.title;
  const eventName = context.eventName;

  let nodeId = undefined;
  let labels = undefined;
  let itemTitle = undefined;

  if (context.payload.issue !== undefined){
    nodeId = context.payload.issue.node_id;
    labels = context.payload.issue.labels;
    itemTitle = context.payload.issue.title;
  }else if (context.payload.pull_request !== undefined){
    nodeId = context.payload.pull_request.node_id;
    labels = context.payload.pull_request.labels;
    itemTitle = context.payload.pull_request.title;
  }

  if (isItemArchivable(labels)){
    const itemData = await getProjectV2ItemFromNodeId(nodeId, projectId, eventName);
    let archivedItem = await archiveProjectV2Item(projectId, itemData.id);
    console.log("=== Project item archived ===")
    writeLog(archivedItem, nodeId, eventName);
  }

  function writeLog(archivedItem, nodeId, eventName){
    console.log("Project title: " + projectTitle);
    console.log("projectId: " + projectId);
    switch(eventName){
      case 'issues':
        console.log("Issue title: " + archivedItem.archiveProjectV2Item.item.fieldValueByName.text);
        console.log("Issue project item id: " + archivedItem.archiveProjectV2Item.item.id);
        console.log("Issue node id: " + nodeId);
        return;
      case 'pull_request':
        console.log("Pull request title: " + archivedItem.archiveProjectV2Item.item.fieldValueByName.text);
        console.log("Pull request project item id: " + archivedItem.archiveProjectV2Item.item.id);
        console.log("Pull request node id: " + nodeId);
        return;
    }
  }

  function isItemArchivable(labels){
    for (const label of labels){
      switch(label.name) {
        case "Has task force":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
        case "Small task":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
        case "Build Infra":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
        case "Bug":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
        case "Critical":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
        case "Priority":
          console.log("=== Project item will not be archived ===");
          console.log("Item title: " + itemTitle);
          console.log("Found label: " + label.name);
          return false;
      }
    }
    return true;
  }

  async function getProjectV2(projectNumber){
    const query = `query($owner: String!, $projectNumber: Int!){
      user(login:$owner) {
        projectV2(number:$projectNumber) {
          id
          title
        }
      }
    }`;
    const variables = {
      owner: context.repo.owner,
      projectNumber: projectNumber,
    };

    return await github.graphql(query, variables);
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

  async function archiveProjectV2Item(projectId, itemId){
    const mutation = `mutation($projectId: ID!, $itemId: ID!){
      archiveProjectV2Item(input: {
        projectId: $projectId
        itemId: $itemId
      }){
        item {
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
      itemId: itemId
    };

    return await github.graphql(mutation, variables);
  }
}
