//const assert = require('assert');
//const { describe } = require('node:test');
//const { Octokit } = require("@octokit/rest");
import { describe, it } from 'mocha';
import { expect } from 'chai';
//import assert from 'assert';
//import { Octokit } from '@octokit/rest'
//import github from '@actions/github';
//import pkg from '@actions/github';
//const { Github } = pkg;
//import * as github from '@actions/github';
//import core from '@actions/core';
//import { Octokit } from 'octokit'
import { Octokit } from '@octokit/core';
//import { createTokenAuth } from '@octokit/auth-token';
import * as githubGraphQLApi from "../github-graphql-api.mjs";

describe('My Tests', function() {
  it('should pass this test', async function() {

    //const auth = createTokenAuth(process.env.TN_PAT);
    //const { token } = await auth();

    //const octokit = new Octokit({ auth: token });
    //const myToken = core.getInput('TN_PAT')
    //const myToken = process.env.TN_PAT;
    //const octokit = github.getOctokit(myToken);

    //const octokit = new Octokit(myToken);

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await githubGraphQLApi.getProjectV2Data(170, 'TravisNickels', octokit );

    expect(response.user.projectV2.id).to.equal('PVT_kwHOBTAVOs4ASxQ8');
  });
});