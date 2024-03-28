# **Capability:** Monitoring

## **Feature:** Endpoint grouping

### **Rule:** The number of grouping segments is determined by the number of periods in the endpoint name

#### **Examples/Scenario**

```gherkin
Given the following monitored endpoints
|Endpoint name|
|-------------|
|Universe.Solarsystem.Endpoint1 |
|Universe.Solarsystem.Endpoint2 |
|Universe.Solarsystem.Endpoint3 |

Then the max number of grouping segments is equal to the number of periods '.' in the endpoint name
and the the following segments are generated

|Group by options |
|no grouping |
|Max. 1 segments |
|Max. 2 segments |

```
