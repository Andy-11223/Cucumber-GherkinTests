@smoke @iframe
Feature: iFrame completion

  Scenario: Successful sizing flow in drawer iframe
    Given I navigate to "https://www.victoriabeckham.com/products/lea-midi-dress-in-ivory-22828" and confirm country by clicking "Shop now" button
    When I click the "UK Size" button and open the drawer iframe 
    And I enter feet "5" and "9" inches
    And I enter my body weight "154" and age "30"
    And I click "Continue" button
    And I select "AVERAGE" option as Hip Shape and Stomach Shape pages and click "Continue" button
    And I select "Band size 40" and "Cup size D" in Chest page and click "Find my ideal size" button
    Then I should see the recommended size "10"