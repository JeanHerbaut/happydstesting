# Bénéficiaires

```gherkin
Feature: Bénéficiaires
  Scenario: Ajouter un bénéficiaire
    Given une activité existante
    When l'administrateur crée un bénéficiaire
    Then il est rattaché à l'activité

  Scenario: Mise à jour d'un bénéficiaire
    Given un bénéficiaire existant
    When l'administrateur modifie ses informations
    Then les changements sont sauvegardés

  Scenario: Suppression d'un bénéficiaire
    Given un bénéficiaire existant
    When l'administrateur le supprime
    Then il est retiré de l'activité
```

