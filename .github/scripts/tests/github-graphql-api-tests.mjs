//const assert = require('assert');
//const { describe } = require('node:test');
//const { Octokit } = require("@octokit/rest");
import { describe, it } from 'mocha';
//import assert from 'assert';
//import { Octokit } from '@octokit/rest'
import github from '@actions/github';
//import { Octokit } from 'octokit'
import * as githubGraphQLApi from "../github-graphql-api.mjs";

describe('My Tests', function() {
  it('should pass this test', async function() {

    console.log("GITHUB_TOKEN: " + process.env.GITHUB_TOKEN );
    console.log("github object: " + github );
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

    /* const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    }); */

    const response = await githubGraphQLApi.getProjectV2Data(170, 'TravisNickels', octokit );

    expect(response.user.projectV2.id).to.equal(170);
  });
});