# Gestion du compte

```gherkin
Feature: Gestion du compte
  Scenario: Mise à jour du profil
    Given un administrateur authentifié lié à un bénévole
    When il modifie ses informations
    Then l'utilisateur et le bénévole sont mis à jour

  Scenario: Validation d'unicité de l'email
    Given deux utilisateurs existent
    When l'un tente de changer son email pour celui de l'autre
    Then une erreur signale l'email déjà pris

  Scenario: Confirmation incorrecte du mot de passe
    Given un administrateur authentifié
    When il saisit deux mots de passe différents
    Then la mise à jour est refusée
```

