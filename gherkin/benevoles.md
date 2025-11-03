# Bénévoles

```gherkin
Feature: Gestion des bénévoles
  Scenario: Création d'un bénévole
    Given un administrateur authentifié
    When il soumet des données valides
    Then le bénévole et l'utilisateur lié sont créés

  Scenario: Validation des champs obligatoires
    Given un administrateur authentifié
    When il soumet un formulaire vide
    Then des erreurs indiquent les champs manquants

  Scenario: Mise à jour d'un bénévole
    Given un bénévole existant et un administrateur authentifié
    When il modifie le bénévole
    Then la fiche est sauvegardée

  Scenario: Contrainte d'unicité de l'email
    Given un bénévole existe avec une adresse email
    When un autre bénévole est créé avec la même adresse
    Then la création est refusée

  Scenario: Contrainte d'unicité de l'AVS
    Given un bénévole existe avec un numéro AVS
    When un autre bénévole est créé avec le même numéro
    Then la création est refusée
    And un message d'erreur signale le numéro AVS déjà utilisé

  Scenario: Validation du téléphone et de l'IBAN
    Given un administrateur saisit des formats invalides
    Then le formulaire signale des erreurs
```

```gherkin
Feature: Spécialisations
  Scenario: Création sans licence obligatoire
    Given un administrateur authentifié
    When il crée une spécialisation sans licence requise
    Then la spécialisation est enregistrée sans licence

  Scenario: Création avec licence obligatoire
    Given un administrateur authentifié
    When il crée une spécialisation nécessitant une licence
    And il renseigne la date de licence
    Then la spécialisation est enregistrée avec la licence

  Scenario: Mise à jour d'une spécialisation
    Given une spécialisation existante
    When l'administrateur modifie ses informations
    Then les changements sont sauvegardés

  Scenario: Suppression d'une spécialisation
    Given une spécialisation existante
    When l'administrateur la supprime
    Then elle n'apparaît plus dans la liste

  Scenario: Date de licence obligatoire
    Given une spécialisation exigeant une licence
    When la date de licence est vide
    Then une erreur indique que la date est obligatoire

```

```gherkin
Feature: Disponibilités
  Scenario: Un bénévole déclare sa disponibilité pour une activité
    Given un bénévole authentifié et une activité future
    When il indique qu'il est disponible
    Then sa disponibilité est enregistrée pour l'activité

  Scenario: Affichage
    Given un bénévole a une activité concurrente
    When il consulte l'activité
    Then les boutons sont masqués
    And le texte "Vous avez déjà une activité à ce moment" apparaît

  Scenario: Réponse positive
    Given un bénévole sans activité concurrente n'a pas encore répondu
    When il clique sur "Oui"
    Then le texte "Vous êtes dispo" apparaît
    And un bouton "Modifier" remplace les boutons
```

```gherkin
Feature: Filtrage des bénévoles
  Scenario: Filtrer les bénévoles par activité planifiée
    Given des bénévoles avec et sans activité planifiée
    When l'administrateur filtre par "planifie"
    Then seuls les bénévoles concernés sont listés

  Scenario: Filtrer par statut ou spécialisation
    Given des bénévoles avec différents statuts et spécialisations
    When l'administrateur applique un filtre par statut ou spécialisation
    Then seuls les bénévoles correspondants sont affichés
```

```gherkin
Feature: Pagination des bénévoles
  Scenario: Afficher 15 bénévoles par page
    Given plus de 15 bénévoles existent
    When l'administrateur consulte la page 2 de la liste
    Then 15 bénévoles sont affichés

  Scenario: Rejet d'un paramètre de page invalide
    Given l'administrateur fournit un paramètre de page non valide
    When il consulte la liste des bénévoles
    Then une erreur indique que le paramètre "page" est incorrect
```

```gherkin
Feature: Statut du bénévole
  Scenario: Désactivation d'un bénévole
    Given un bénévole "Actif" et un administrateur
    When l'administrateur le désactive
    Then son statut devient "Inactif"
    And une notification est envoyée

  Scenario: Activation d'un bénévole
    Given un bénévole "Inactif" et un administrateur
    When l'administrateur l'active
    Then son statut devient "Actif"
    And une notification est envoyée

  Scenario: Attribution du rôle administrateur
    Given un bénévole "Actif" sans rôle administrateur
    When un administrateur lui attribue le rôle
    Then le bénévole devient administrateur

  Scenario: Retrait du rôle administrateur
    Given un bénévole administrateur
    When un administrateur retire le rôle
    Then le bénévole n'est plus administrateur
```

