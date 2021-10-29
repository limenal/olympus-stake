# Olympus Subgraph

[Uniswap](https://uniswap.org/) is a decentralized protocol for automated token exchange on Ethereum.

This subgraph dynamically tracks:

- stakes,
- deposits,
- rebases

## Deployment

1. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

2. Run `graph auth --product hosted-service <ACCESS_TOKEN>`

3. Deploy via `graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>`. 

## Queries

Below are a few ways to show how to query the uniswap-subgraph for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Key Entity Overviews

#### Entity nesting
We use nesting of entities, since this allows us to bypass the limitation of the `first` command by 1000 elements and this allows us to get all the necessary data from the subgaph in one request.

#### DepositYearEntity, DepositDayEntity, DepositMinuteEntity

This entities tracks deposits and redeems for const list of tokens.

#### StakeYearEntity, DepositDayEntity, DepositMinuteEntity

This entities tracks stakes and unstakes.

#### RebaseYear, RebaseDay

This entities tracks rebases for APY calculation.
