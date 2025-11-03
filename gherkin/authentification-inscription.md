# Authentification & inscription

```gherkin
Feature: Authentification
  Scenario: L'administrateur se connecte avec succès
    Given un administrateur existe
    When il saisit des identifiants valides
    Then il accède au tableau de bord

  Scenario: Échec de connexion avec un mauvais mot de passe
    Given un administrateur existe
    When il saisit un mot de passe invalide
    Then l'authentification est refusée

  Scenario: Déconnexion
    Given un utilisateur authentifié
    When il se déconnecte
    Then la session redevient invitée
```

```gherkin
Feature: Inscription des bénévoles
  Scenario: Auto-inscription d'un candidat
    Given aucun bénévole n'existe avec l'adresse email du candidat
    When le candidat soumet le formulaire d'inscription
    Then un bénévole est créé avec le statut "À valider"

  Scenario: Validation par un administrateur
    Given un administrateur authentifié
    And un bénévole "À valider" existe
    When l'administrateur active le bénévole
    Then son statut devient "Actif"

  Scenario: Refus d'inscription
    Given un administrateur authentifié
    And un bénévole "À valider" existe
    When l'administrateur refuse l'inscription
    Then le bénévole est supprimé
    And le candidat est notifié du refus
```

```gherkin
Feature: Réinitialisation du mot de passe
  Scenario: Un utilisateur réinitialise son mot de passe
    Given un utilisateur existe
    When il demande un lien de réinitialisation
    And il définit un nouveau mot de passe via le lien
    Then il se connecte avec le nouveau mot de passe
    And l'ancien mot de passe n'est plus valide
```

