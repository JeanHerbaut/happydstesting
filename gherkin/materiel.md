# Matériel

```gherkin
Feature: Matériel
  Scenario: Création de matériel
    Given un administrateur authentifié
    When il fournit les informations requises
    Then le matériel est ajouté à la liste

  Scenario: Enregistrement d'une révision
    Given un matériel existant
    When sa date de révision change
    Then une entrée d'historique est créée

  Scenario: Affectation d'un matériel disponible
    Given une activité et un matériel non loué sur la période
    When l'administrateur l'affecte à l'activité
    Then l'affectation est enregistrée

  Scenario: Rejet d'une affectation pour chevauchement
    Given un matériel déjà loué sur la période
    When l'administrateur tente de l'affecter à une autre activité sur la même période
    Then l'affectation est refusée

  Scenario: Retrait d'un matériel affecté
    Given une activité avec un matériel affecté
    When l'administrateur retire le matériel
    Then le matériel redevient disponible pour d'autres activités
  
  Scenario: Filtrer le matériel par nom
    Given plusieurs matériels existent avec des noms différents
    When l'administrateur filtre la liste par nom
    Then seuls les matériels correspondant au nom recherché sont affichés

  Scenario: Filtrer le matériel par disponibilité
    Given du matériel disponible et du matériel loué existent
    When l'administrateur filtre la liste par disponibilité
    Then seuls les matériels correspondant à la disponibilité choisie sont affichés

  Scenario: Paramètres de filtrage invalides
    Given un administrateur authentifié
    When il fournit des paramètres de filtrage invalides
    Then la liste n'est pas filtrée
    And un message d'erreur est affiché
```

Règles de conflit de dates :
- Deux locations de matériel sont en conflit si leurs périodes se chevauchent, même partiellement.
- Les bornes de dates de location sont inclusives.

```gherkin
Feature: Locations de matériel
  Scenario: Contacts obligatoires
    Given une activité de type "Location de matériel"
    When l'administrateur omet les informations de contact
    Then la création est refusée

  Scenario: Mise à jour du paiement de la location
    Given une location passée
    When l'administrateur saisit le montant payé
    Then la location est marquée payée
```

