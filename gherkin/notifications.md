# Notifications

```gherkin
Feature: Notifications de rafraîchissement
  Scenario: Afficher un indicateur lorsqu'un rafraîchissement est dû
    Given un bénévole avec une spécialisation expirée
    When l'administrateur consulte la liste
    Then un indicateur de rafraîchissement apparaît

  Scenario: Envoi d'un rappel individuel
    Given la variable d'environnement REFRESH_NOTIFICATIONS_ENABLED est activée
    And un bénévole doit rafraîchir une spécialisation
    When l'administrateur déclenche un rappel
    Then un rappel est envoyé au bénévole
    And une entrée est enregistrée dans la table refresh_notifications

  Scenario: Envoi groupé pour plusieurs bénévoles
    Given la variable d'environnement REFRESH_NOTIFICATIONS_ENABLED est activée
    And plusieurs bénévoles doivent rafraîchir une spécialisation
    When l'administrateur déclenche un rappel groupé
    Then chaque bénévole reçoit un rappel
    And une entrée est enregistrée pour chaque rappel dans refresh_notifications

  Scenario: Limitation à un rappel par 30 jours pour un même binôme bénévole/spécialisation
    Given la variable d'environnement REFRESH_NOTIFICATIONS_ENABLED est activée
    And un rappel a été envoyé pour un bénévole et une spécialisation il y a moins de 30 jours
    When l'administrateur tente de renvoyer un rappel
    Then aucun nouveau rappel n'est envoyé
    And aucune nouvelle entrée n'est ajoutée à refresh_notifications
```

```gherkin
Feature: Rappels de disponibilité
  Scenario: Un administrateur copie un rappel de disponibilité
    Given une activité sans réponses de disponibilité
    When l'administrateur copie un rappel de disponibilité
    Then le message est placé dans le presse-papiers de l'administrateur
```

