# TF-Automation

Just a test repo for Task force project board creation

> **Note**
> Make sure to create an `error` queue and a queue that is the name of your AzureWebJobsStorage inside of your AzureWebJobsServiceBus

**Get asb-transport CLI**
```ps
dotnet tool install -g NServiceBus.Transport.AzureServiceBus.CommandLine
```

**Create the endpoint queue**

> **Note**
> Make sure to use the `-c` option if you want to override or do not have the `AzureServiceBus_ConnectionString` environment variable set.

```shell
asb-transport endpoint create <queue name>
```

**Subscribe to events**
```shell
asb-transport endpoint subscribe <queue name> <eventtype>
```

***

## Graphql Authentication

Before running GitHub CLI commands, you must authenticate by running `gh auth login --scopes "project"`. If you only need to read, but not edit, projects, you can provide the `read:project` scope instead of `project`. For more information on command line authentication, see "[gh auth login](https://cli.github.com/manual/gh_auth_login)."

## legacy_global_id / next_global_id

legacy_global_id is is now deprecated, which typically looks like this `MDQ6VXNlcjM0MDczMDM=`.  There is now a next_global_id that is being used that has a format like `PVT_kwHOBTAVOs4ANTT3`. By adding another header to the API call the new `next_global_id` can be retrieved.

##### Powershell

Instead of doing this command to get the `node_id` of an authenticated user

```graphql
gh api -H "Accept: application/vnd.github+json" /users/{username}
```

##### Result

```json
{
  "node_id": "MDQ6VXNlcjg3MDM3MjQy"
}
```

Add this to the API call to get the new next_global_id `node_id`

```graphql
gh api -H "Accept: application/vnd.github+json" -H "X-Github-Next-Global-ID: 1" /users/{username}
```
```json
{
  "node_id": "U_kgDOBTAVOg"
}
```

## Creating projects
To create a new project using the API, you'll need to provide a name for the project and the node ID of a GitHub user or organization who will become the project's owner.

You can find the node ID of a GitHub user or organization if you know the username. Replace `GITHUB_OWNER` with the GitHub username of the new project owner.
To create the project, replace OWNER_ID with the node ID of the new project owner and replace PROJECT_NAME with a name for the project.

To create the project, replace `OWNER_ID` with the `node_id` of the new project owner using the new `next_global_id` and replace `PROJECT_NAME` with a name for the project.

##### Powershell
When using powershell and doing a query or mutation make sure to escape the quotation marks `"` using a a backslash `\` when indicating a String. 
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" -f query='mutation{createProjectV2(input:{ownerId:\"U_kgDOBTAVOg\",title:\"TF-Project\"}){projectV2{id}}}'
```
##### Result
```json
{
  "data": {
    "createProjectV2": {
      "projectV2": {
        "id": "PVT_kwHOBTAVOs4ANThR"
      }
    }
  }
}
```

### Using the legacy_node_id

If you use the legacy_node_id, but include the `X-Github-Next-Global-ID: 1` header then the project will get created, but a deprecation warning will show up letting you  know that you should use `next_global_id` instead.

##### Powershell
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" -f query='mutation{createProjectV2(input:{ownerId:\"MDQ6VXNlcjg3MDM3MjQy\",title:\"TF-Project\"}){projectV2{id}}}'
```
##### Result
```json
{
  "data": {
    "createProjectV2": {
      "projectV2": {
        "id": "PVT_kwHOBTAVOs4ANTjy"
      }
    }
  },
  "extensions": {
    "warnings": [
      {
        "type": "DEPRECATION",
        "message": "The id MDQ6VXNlcjg3MDM3MjQy is deprecated. Update your cache to use the next_global_id from the data payload.",
        "data": {
          "legacy_global_id": "MDQ6VXNlcjg3MDM3MjQy",
          "next_global_id": "U_kgDOBTAVOg"
        },
        "link": "https://docs.github.com"
      }
    ]
  }
}
```

## Get node_id for project

##### Powershell
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" --raw-field query='query{ user(login:\"{username}\") { projectV2(number: 11) { id } } }'
```
##### Result
```json
{
  "data": {
    "user": {
      "projectV2": {
        "id": "PVT_kwHOBTAVOs4ANTT3"
      }
    }
  }
}
```

## Get node_id for issue

##### Powershell
```graphql
gh api graphql -H "X-Github-Next-Global-ID: 1" --raw-field query='query{ repository(owner:\"TravisNickels\", name:\"TF-Automation\") { issue(number: 1) { id } } }'
```
##### Result
```json
{
  "data": {
    "repository": {
      "issue": {
        "id": "I_kwDOJJR3y85mmxkx"
      }
    }
  }
}
```


## Links
- https://github.com/octokit/octokit.graphql.net
- https://github.com/boblangley/tf-automation
- https://cli.github.com/manual/gh_api
- https://devopsjournal.io/blog/2022/11/28/github-graphql-queries
- https://github.com/community/community/discussions/39777
- https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects
- https://api.github.com/users/{username}
- https://docs.gitlab.com/ee/api/projects.html
- https://www.apollographql.com/blog/graphql/basics/using-the-github-graphql-api-with-apollo-studio-explorer/
- https://graphql.org/
