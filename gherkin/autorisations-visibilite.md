# Autorisations & visibilité

```gherkin
Feature: Visibilité et autorisations
  Scenario: Masquer la colonne Actions pour les non administrateurs
    Given un utilisateur non administrateur
    When il consulte la liste des activités
    Then la colonne Actions est cachée

  Scenario: Lien vers autres bénévoles caché
    Given un non administrateur
    When il consulte une activité avec plusieurs bénévoles
    Then seul son propre nom est cliquable

  Scenario: Lien de retour à la liste des pilotes
    Given la fiche d'un bénévole
    When un utilisateur non administrateur la consulte
    Then le lien "Retour à la liste des pilotes" est absent
    When un administrateur la consulte
    Then le lien "Retour à la liste des pilotes" est visible

  Scenario: Suppression interdite aux bénévoles non administrateurs
    Given un bénévole authentifié "Actif" sans rôle administrateur
    And un autre bénévole "Actif" existe
    When il tente de supprimer ce bénévole
    Then l'action est refusée

  Scenario: Archivage d'une activité refusé aux non administrateurs
    Given un bénévole authentifié "Actif" sans rôle administrateur
    And une activité "Planifiée" existe
    When il tente d'archiver l'activité
    Then l'action est refusée

  Scenario: Accès aux bénéficiaires limité aux administrateurs
    Given un bénévole authentifié "Actif" sans rôle administrateur
    When il consulte la liste des bénéficiaires
    Then l'accès est refusé

  Scenario: Accès au matériel limité aux administrateurs
    Given un bénévole authentifié "Actif" sans rôle administrateur
    When il consulte la liste du matériel
    Then l'accès est refusé

  Scenario: Affichage du compteur des réponses positives réservé aux administrateurs
    Given une activité avec des disponibilités enregistrées
    And un administrateur authentifié
    When il consulte la liste des activités
    Then le compteur des réponses positives des bénévoles est affiché pour ce rôle uniquement
```

