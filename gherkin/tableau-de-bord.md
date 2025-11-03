# Tableau de bord

```gherkin
Feature: Tableau de bord
  Scenario: Lister les activités à venir en mettant les incomplètes en premier
    Given plusieurs activités planifiées, certaines complètes et d'autres incomplètes
    And une activité passée existe
    When l'administrateur consulte le tableau de bord
    Then seules les activités à venir sont listées
    And les activités incomplètes apparaissent avant les complètes

  Scenario: Trier les bénévoles par nombre de paiements en attente
    Given plusieurs bénévoles avec des paiements en attente
    When l'administrateur trie les bénévoles par paiements en attente
    Then la liste est ordonnée par nombre décroissant de paiements en attente

  Scenario: Rafraîchir le cache du tableau de bord après confirmation d'une activité
    Given une activité "Planifiée" et des données en cache pour le tableau de bord
    When l'activité est confirmée
    Then le cache du tableau de bord est rafraîchi

  Scenario: Afficher les badges de compte sur le tableau de bord
    Given des bénévoles à activer, des paiements en attente, des confirmations en attente, des rappels de rafraîchissement et des activités incomplètes
    When l'administrateur consulte le tableau de bord
    Then des badges indiquent les nombres de bénévoles à activer, de paiements en attente, de confirmations en attente, de rappels de rafraîchissement à envoyer et d'activités incomplètes
```

