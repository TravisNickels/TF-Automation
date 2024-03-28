# Capability: Monitoring

## Feature: Endpoint grouping

### Rule: The number of grouping segments is determined by the number of periods in the endpoint name

#### _Example_: All endpoints have two periods in their name

> ```gherkin
> Given the following monitored endpoints
> ```
>
> | Endpoint name                  |
> | ------------------------------ |
> | Universe.Solarsystem.Endpoint1 |
> | Universe.Solarsystem.Endpoint2 |
> | Universe.Solarsystem.Endpoint3 |
>
> ```gherkin
> Then the max number of grouping segments is equal to the number of periods '.'
> in the endpoint name and the following segments are generated
> Example
> ```
>
> | Group by options |
> | ---------------- |
> | no grouping      |
> | Max. 1 segments  |
> | Max. 2 segments  |

#### _Example_: One endpoint has three periods in its name and the other endpoints have two periods in their name

> ```gherkin
> Given the following monitored endpoints
> ```
>
> | Endpoint name                        |
> | ------------------------------------ |
> | Universe.Solarsystem.Earth.Endpoint1 |
> | Universe.Solarsystem.Endpoint2       |
> | Universe.Solarsystem.Endpoint3       |
>
> ```gherkin
> When 1 endpoint has more periods '.' in the endpoint name
> Then the max number of grouping segments is equal to the number of periods '.'
>      in the endpoint name that has the most periods
> Example
> ```
>
> | Group by options |
> | ---------------- |
> | no grouping      |
> | Max. 1 segments  |
> | Max. 2 segments  |
> | Max. 3 segments  |
