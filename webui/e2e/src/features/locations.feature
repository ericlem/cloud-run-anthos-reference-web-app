Feature: Location Management
  # Scenarios on this feature need to be run in the defined order.

  Scenario: Create Location
    Given I logged in
    When I go to "locations" page
    Then I should see some entries
    When I click "Create" button
    And I fill in "name" with "test loc 1"
    And I fill in "warehouse" with "WH1"
    And I click "Submit" button
    Then I should see Location named "test loc 1"
    Then I should see Location in warehouse "WH1"
    When I click "Back" button
    Then I should see 1 more entries

  # This scenario depends on the "Create Location" scenario.
  Scenario: Edit Location
    When I go to "locations" page
    And I click on link "test loc 1"
    And I click "Edit" button
    And I fill in "warehouse" with "WH2"
    And I click "Submit" button
    Then I should see Location named "test loc 1"
    Then I should see Location in warehouse "WH2"

  # This scenario depends on the "Create Location" scenario.
  Scenario: Delete Location
    When I go to "locations" page
    And I click on link "test loc 1"
    And I click "Delete" button
    And I go to "locations" page
    Then I should see 1 fewer entries