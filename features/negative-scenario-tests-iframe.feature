@negative @iframe 
Feature: Negative iframe scenario support

  Background:
    Given I navigate directly to the drawer "https://drawer.kleep.ai/?domain=www.victoriabeckham.com&product_id=15027721240952&customer_id=&lang=en&countryCode=GB&variantId=55558132662648&category=clothing" 

  @negative @iframe @screenshot
  Scenario: Continue button stays disabled when all measurements are invalid
    When I enter feet "0" and "0" inches
    And I enter my body weight "0" and age "0"
    Then the "Continue" button should be disabled

  Scenario Outline: Validation message is shown for a single invalid field
    When I enter feet "<feet>" and "<inches>" inches
    And I enter my body weight "<weight>" and age "<age>"
    Then the "Continue" button should be disabled
    And I should see the validation message "<message>"

    Examples:
      | feet | inches | weight | age | message                        |
      | 0    | 9      | 154    | 30  | Please indicate your height.   |
    #  | 5    | 0      | 154    | 30  | Please indicate your height.   | - reported issue, without fix on front end, yet
      | 5    | 9      | 0      | 30  | Please indicate your weight.   |
      | 5    | 9      | 154    | 0   | Please indicate your age.      |