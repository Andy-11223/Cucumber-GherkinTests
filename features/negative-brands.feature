@negative @iframe @screenshot @generated
Feature: Negative sizing flow across brands (env: prod)

  # AUTO-GENERATED FILE — do not edit directly.
  # Edit data/brands.csv and rerun:
  #   npm run generate:brands -- --env=dev|staging|prod

  Scenario Outline: Continue button stays disabled when all measurements are invalid
    Given I navigate directly to the drawer "<url>"
    When I enter feet "0" and "0" inches
    And I enter my body weight "0" and age "0"
    Then the "Continue" button should be disabled

    Examples:
      | url |
      | https://drawer.kleep.ai/?domain=www.givenchy.com&product_id=PF7839-00-001&lang=en&countryCode=GB&mock=true |
      
