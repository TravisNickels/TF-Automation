//const assert = require('assert');
//const { describe } = require('node:test');
//const { Octokit } = require("@octokit/rest");
import { describe, it } from 'mocha';
import { expect } from 'chai';
import nock from 'nock';
//import assert from 'assert';
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
//import github from '@actions/github';
//import pkg from '@actions/github';
//const { Github } = pkg;
//import * as github from '@actions/github';
//import core from '@actions/core';
//import { Octokit } from 'octokit'
//import { Octokit } from '@octokit/core';
//import { createTokenAuth } from '@octokit/auth-token';
import * as githubGraphQLApi from "../github-graphql-api.mjs";

describe('My Tests', function() {
  before(() => {
    // Set up nock to intercept Github API requests
    /* nock('https://api.github.com')
      .post('/graphql') // Mock the GraphQL endpoint
      .reply(200, (uri, requestBody) => {
        console.log('Intercepted GraphQL request:', uri, requestBody);
        return { data: { user: { projectV2: { id: "PVT_UyhstYisiOxQ8yTr"}}}};
    }); */

    nock('https://api.github.com')
      .post('/graphql')
      .reply(200, {
        data: {
          repository: {
            name: 'mocked-repo',
            description: 'Mocked description',
          },
        },
      });
  })
  it('should pass this test', async function() {

    //const auth = createTokenAuth(process.env.TN_PAT);
    //const { token } = await auth();

    //const octokit = new Octokit({ auth: token });
    //const myToken = core.getInput('TN_PAT')
    //const myToken = process.env.TN_PAT;
    //const octokit = github.getOctokit(myToken);

    //const octokit = new Octokit(myToken);

    const octokit = new Octokit({
      //auth: process.env.TN_PAT,
      auth: process.env.GITHUB_TOKEN,
    });

    // Your GraphQL query
    const query = `
      query {
        repository(owner: "TravisNickels", name: "TF-Automation") {
          name
          description
        }
      }
    `;

    try {
      const response = await octokit.graphql(query);
      console.log("response.repository.name: " + response.repository.name);
      console.log("response.repository.description: " + response.repository.description);
      expect(response.repository.name).to.equal('mocked-repo');
      return response.repository;
    } catch (error) {
      throw error;
    }

    //const response = await graphql(query, { headers: { authorization: process.env.TN_PAT, }, }, variables);

    //const response = await octokit.graphql(query, variables);

    const response = await githubGraphQLApi.getProjectV2Data(170, 'TravisNickels', octokit );

    expect(response.user.projectV2.id).to.equal('PVT_UyhstYisiOxQ8yTr');
    //expect(response.user.projectV2.id).to.equal('PVT_kwHOBTAVOs4ASxQ8_asdf');
    expect(response).to.deep.equal({ user: { projectV2: { id: "PVT_UyhstYisiOxQ8yTr"}}});
  });
});