Feature: User Login

  Scenario: Successful login on Playground
    Given I navigate to "https://playground.bondaracademy.com/"
    When I click the "Forms" and "Form Layouts" buttons to proceed to the form page
    When I enter email "testonemore@123.com" and password "12345678"
    When I mark "Option 1" checkbox
    When I press the "Sign in" button
    Then I should see the filled fields with "testonemore@123.com" and "12345678" and marked checkbox "Option 1"