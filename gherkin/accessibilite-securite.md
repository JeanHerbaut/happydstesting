# Accessibilité & sécurité

```gherkin
Feature: Accessibilité du contenu
  Scenario: Présence d'un lien d'évitement
    Given la page de connexion est affichée
    When le document est chargé
    Then un lien "Aller au contenu" précède le contenu principal
```

```gherkin
Feature: En-têtes de sécurité
  Scenario: Application des en-têtes HTTP
    When un utilisateur consulte le site
    Then la réponse inclut les en-têtes de sécurité "X-Frame-Options", "X-Content-Type-Options" et "Referrer-Policy"
```
