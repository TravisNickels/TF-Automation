# Feature: Staying alive

This is about actually staying alive,
not the Bee Gees song

## Rule: If you don't eat you die

`@important` `@essential`

### Scenario Outline: eating

- Given there are <start> cucumbers
- When I eat <eat> cucumbers
- Then I should have <left> cucumbers

#### Examples

| start | eat | left |
| 12    | 5   | 7    |
| 20    | 5   | 15   |



Feature: Serve coffee
  In order to earn money
  Customers should be able to 
  buy coffee at all times

  Scenario: Buy last coffee
    Given there are 1 coffees left in the machine
    And I have deposited 1 dollar
    When I press the coffee button
    Then I should be served a coffee

    Examples:
      | start | eat | left |
      | 12    | 5   | 7    |
      | 20    | 5   | 15   |