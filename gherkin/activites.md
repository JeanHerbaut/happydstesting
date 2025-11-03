# Activités

```gherkin
Feature: Gestion des activités
  Scenario: Création d'une activité
    Given un administrateur authentifié
    When il renseigne les champs requis
    Then l'activité est enregistrée avec statut planifié

  Scenario: Création d'une activité à confirmer
    Given un administrateur authentifié
    When il coche l'option "Activité à confirmer" lors de la création
    Then l'activité est enregistrée avec statut "À confirmer"

  Scenario: Confirmation d'une activité
    Given une activité avec statut "À confirmer"
    When l'administrateur confirme l'activité
    Then son statut devient "Planifiée"

  Scenario: Duplication d'une activité
    Given une activité existe
    When l'administrateur la duplique
    Then une nouvelle activité identique est créée

  Scenario: Filtre par statut
    Given plusieurs activités avec différents statuts
    When l'administrateur filtre par "Planifiée"
    Then seules les activités planifiées sont listées

  Scenario: Mise à jour d'une activité
    Given une activité existante
    When l'administrateur modifie ses informations
    Then les changements sont sauvegardés

  Scenario: Nomination d'un gestionnaire
    Given une activité sans gestionnaire
    When l'administrateur choisit un administrateur dans la zone "Gestionnaire"
    And il confirme avec le bouton "Nommer gestionnaire"
    Then la colonne "Gestionnaire" de l'activité affiche le nom sélectionné

  Scenario: Changement de gestionnaire
    Given une activité avec un gestionnaire nommé
    When l'administrateur sélectionne un autre administrateur dans la zone "Gestionnaire"
    And il confirme avec le bouton "Nommer gestionnaire"
    Then la colonne "Gestionnaire" de l'activité affiche le nouveau nom

  Scenario: Suppression du gestionnaire
    Given une activité avec un gestionnaire nommé
    When l'administrateur sélectionne "Aucun" dans la zone "Gestionnaire"
    And il confirme avec le bouton "Nommer gestionnaire"
    Then la colonne "Gestionnaire" de l'activité indique "Aucun"

  Scenario: Suppression d'une activité
    Given une activité existante
    When l'administrateur la supprime
    Then elle n'apparaît plus dans la liste
```

```gherkin
Feature: Quotas de compétences
  Scenario: Définition d'un quota pour une spécialisation
    Given une spécialisation requiert trois bénévoles
    When l'administrateur fixe le quota
    Then la valeur du quota est enregistrée

  Scenario: Alerte lorsque le quota n'est pas atteint
    Given une activité nécessite une spécialisation
    And seulement un bénévole qualifié est assigné
    When l'administrateur consulte l'activité
    Then une alerte indique que le quota n'est pas atteint

  Scenario: Situation où le quota est satisfait
    Given une activité nécessite une spécialisation
    And le nombre requis de bénévoles qualifiés est atteint
    When l'administrateur consulte l'activité
    Then aucune alerte de quota n'est affichée
```

```gherkin
Feature: Retour d'activité
  Scenario: Le responsable soumet un feedback une seule fois
    Given un bénévole responsable d'une activité
    When il envoie son retour après l'activité
    Then un second envoi est refusé
    And le formulaire disparaît

  Scenario: Signalement de matériel endommagé
    Given un bénévole responsable signale un matériel endommagé
    When il soumet le formulaire de retour
    Then une notification est envoyée à l'adresse d'alerte

  Scenario: Consultation du feedback par un administrateur
    Given une activité avec un feedback soumis
    When l'administrateur consulte l'activité
    Then le feedback est affiché

```

```gherkin
Feature: Calendrier des activités
  Scenario: Consultation d'une activité depuis le calendrier
    Given une activité planifiée existe
    When l'utilisateur affiche la vue calendrier
    And il clique sur l'activité dans la vue Mois ou Semaine
    Then une modale affiche les informations de l'activité
```

