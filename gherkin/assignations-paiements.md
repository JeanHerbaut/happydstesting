# Assignations & paiements

```gherkin
Feature: Assignations
  Scenario: Assigner un bénévole à une activité
    Given une activité et un bénévole
    When l'administrateur les associe
    Then la participation est enregistrée avec le statut "Planifié"

  Scenario: Assigner un bénévole malgré un quota atteint
    Given une activité dont le quota est atteint
    And un bénévole actif sans conflit
    When l'administrateur l'associe
    Then la participation est enregistrée avec le statut "Planifié"

  Scenario: Retirer un bénévole d'une activité payée
    Given une participation "Facturé" pour un bénévole
    When l'administrateur retire cette participation
    Then l'opération est refusée
    And le message d'erreur "errors.volunteer_already_paid" est affiché

  Scenario: Sélection des pilotes selon disponibilité
    Given des pilotes ayant répondu « Oui » ou « Non » à la disponibilité
    When l'administrateur ouvre l'assignation
    Then seuls les pilotes disponibles et qualifiés sont sélectionnables
    And les pilotes « Oui » sont listés avec bouton « Assigner » et checkbox « Définir comme responsable »
    And les pilotes « Non » apparaissent grisés avec mention « A répondu négativement à la disponibilité »
```

```gherkin
Feature: Gestion des responsables
  Scenario: Définir un responsable pour une activité
    Given une activité et un bénévole qualifié
    When l'administrateur l'assigne comme responsable
    Then le bénévole est marqué responsable de l'activité

  Scenario: Retirer le responsable d'une activité
    Given une activité avec un responsable
    When l'administrateur retire ce responsable
    Then l'activité n'a plus de responsable

  Scenario: Case responsable désactivée si un responsable existe
    Given une activité avec un responsable
    When l'administrateur consulte la fiche de l'activité
    Then la case à cocher "Responsable" est désactivée pour les autres bénévoles

  Scenario: Affichage conditionnel du bouton de retrait
    Given une activité avec un responsable
    When l'administrateur consulte l'activité
    Then le bouton pour retirer la responsabilité apparaît uniquement pour les statuts modifiables

  Scenario: Suppression du responsable réinitialise l'interface
    Given une activité avec un responsable
    When l'administrateur retire ce responsable
    Then l'indicateur "Responsable" et le bouton de retrait disparaissent

  Scenario: Un seul responsable par activité
    Given une activité avec un responsable
    When un autre bénévole est défini comme responsable
    Then seul le dernier bénévole reste responsable
```

```gherkin
Feature: Statut de dotation
  Scenario: Activité sans quotas
    Given une activité sans quota global ni quotas de spécialisation
    When un bénévole est assigné
    Then le champ "staffing_status" est "Non défini"

  Scenario: Quota global sans quotas de spécialisation
    Given une activité avec un quota global de 1
    When un bénévole est assigné
    Then le champ "staffing_status" est "Complet"

  Scenario: Quotas à atteindre
    Given une activité avec des quotas de spécialisation mais sans quota global
    When tous les quotas ne sont pas remplis
    Then le champ "staffing_status" est "Incomplet"

  Scenario: Quotas remplis
    Given une activité avec un quota global de 2
    And des quotas de spécialisation totalisant 2
    When deux bénévoles qualifiés sont assignés
    Then le champ "staffing_status" est "Complet"

  Scenario: Dépassement des quotas
    Given une activité avec un quota global de 2
    When trois bénévoles sont assignés
    Then le champ "staffing_status" est "Sureffectif"
```

```gherkin
Feature: Paiement des activités
  Scenario: Payer une participation
    Given une activité terminée avec un bénévole "Planifié"
    When l'administrateur enregistre le paiement
    Then le statut de la participation devient "Facturé"

  Scenario: Enregistrer un paiement de réservation
    Given une activité planifiée
    When l'administrateur saisit le paiement de réservation
    Then le montant de réservation est sauvegardé pour l'activité
```

```gherkin
Feature: Bulletins de salaire
  Scenario: Création et validation d'un bulletin
    Given un administrateur authentifié et un bénévole
    When il crée un bulletin avec des données valides
    Then le bulletin est enregistré
    And les champs requis sont validés

  Scenario: Mise à jour d'un bulletin
    Given un bulletin existant
    When l'administrateur modifie les montants
    Then les changements sont sauvegardés

  Scenario: Affichage du détail des activités dans le modal de salaire
    Given un bulletin lié à une activité
    When l'administrateur consulte le modal des salaires
    Then le détail de l'activité est affiché

  Scenario: Totaux calculés et liens d'édition
    Given un bulletin avec lignes de paiement
    When l'administrateur consulte le bulletin
    Then les totaux sont calculés
    And des liens permettent d'éditer ou commenter le bulletin

  Scenario: Recalculer un bulletin après modification d'activité
    Given un bulletin généré à partir d'une activité déjà payée
    When le montant de l'activité est modifié puis le paiement est relancé
    Then la ligne existante est mise à jour sans doublon
    And les totaux du bulletin reflètent les nouveaux montants

  Scenario: Validation des filtres lors de la recherche
    When l'administrateur fournit des filtres non entiers pour année, mois ou bénévole
    Then une erreur est retournée

  Scenario: Messages traduits lors des opérations
    When l'administrateur crée, met à jour ou retire une activité du bulletin
    Then un message de confirmation traduit est affiché

  Scenario: Suppression d'un bulletin
    Given un bulletin existant
    When l'administrateur le supprime
    Then le bulletin n'apparaît plus dans la liste
```

```gherkin
Feature: Statut des activités
  Scenario: Création d'une activité planifiée
    Given un administrateur planifie une activité sans bénévoles assignés
    When il enregistre l'activité
    Then le statut de l'activité est "Planifiée"
    And le champ "staffing_status" est "Incomplet"

  Scenario: Paiement partiel déclenchant En cours de paiement
    Given une activité "À facturer" avec tous les bénévoles assignés
    And le champ "staffing_status" est "Complet"
    When l'administrateur enregistre un paiement pour un bénévole
    Then le statut de l'activité devient "En cours de paiement"
    And le champ "staffing_status" reste "Complet"

  Scenario: Paiements complets puis archivage et désarchivage
    Given une activité "En cours de paiement" avec tous les bénévoles assignés
    And le champ "staffing_status" est "Complet"
    When l'administrateur enregistre les paiements restants
    Then le statut de l'activité devient "Paiements complets"
    And le champ "staffing_status" reste "Complet"
    When il archive l'activité
    Then le statut de l'activité devient "Archiviée"
    And le champ "staffing_status" reste "Complet"
    When il désarchive l'activité
    Then le statut de l'activité redevient "Paiements complets"
    And le champ "staffing_status" reste "Complet"
```

```gherkin
Feature: Parcours complet
  Scenario: De la création du bénévole au paiement de l'activité
    Given un administrateur authentifié
    When il crée un bénévole avec des données valides
    Then le bénévole est enregistré

    When il planifie une nouvelle activité
    Then l'activité est sauvegardée avec statut "Planifiée"

    When il assigne le bénévole à l'activité
    Then la participation du bénévole est enregistrée avec statut "Planifié"

    When il enregistre le paiement de la participation
    Then la participation est marquée "Facturée"
    And le statut de l'activité devient "Paiements complets"
```

