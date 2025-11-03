# Salaires

```gherkin
Feature: Gestion des bulletins de salaire
  Scenario: Consulter les bulletins récents
    Given un administrateur authentifié
    And des bulletins générés pour plusieurs bénévoles
    When il ouvre le module « Salaires »
    Then les bulletins correspondants s'affichent avec les montants et périodes

  Scenario: Prévisualiser un bulletin en brouillon
    Given un administrateur authentifié
    And un bulletin non généré pour un pilote
    When il clique sur l'icône « Prévisualiser »
    Then le PDF s'ouvre avec un filigrane « BROUILLON »
    And le bulletin reste marqué comme non généré

  Scenario: Marquer un bulletin comme payé
    Given un bulletin avec le statut « En attente »
    When l'administrateur indique la date de paiement
    Then le bulletin passe au statut « Payé »
    And la date de paiement est enregistrée

  Scenario: Modifier le détail d'un bulletin
    Given un bulletin existant avec plusieurs activités
    When l'administrateur ajuste les montants ou commentaires
    Then les changements sont sauvegardés
    And le total du bulletin est recalculé

  Scenario: Générer plusieurs bulletins et notifier les pilotes
    Given des bulletins sélectionnés pour différents pilotes
    When l'administrateur confirme la génération groupée
    Then chaque bulletin est marqué comme généré avec la date et l'auteur
    And un email informe chaque pilote que la fiche est disponible dans dsplanif
    And un message récapitulatif indique le nombre de bulletins générés

  Scenario: Régénérer un bulletin après modification
    Given un bulletin généré existant
    And l'administrateur met à jour ses montants
    When il relance la génération du bulletin
    Then une nouvelle version du PDF est produite avec les valeurs mises à jour
    And le filigrane de validation reflète la nouvelle date

  Scenario: Archiver un bulletin
    Given un bulletin payé
    When l'administrateur l'archive
    Then le bulletin disparaît de la liste active
    And reste consultable dans la vue des archives
```

```gherkin
Feature: Export et envoi des salaires
  Scenario: Exporter les bulletins filtrés
    Given un administrateur a sélectionné une période et certains bulletins
    When il clique sur « Exporter les salaires affichés »
    Then un fichier Excel est généré avec uniquement les bulletins filtrés
    And le nom du fichier reprend la période, la date et l'heure d'export

  Scenario: Exporter toutes les lignes visibles sans sélection
    Given un administrateur a filtré la liste sans cocher de bulletins
    When il lance l'export
    Then toutes les lignes correspondant aux filtres sont incluses dans le fichier

  Scenario: Envoyer les bulletins à Bexio
    Given des adresses configurées dans l'onglet « Envois Bexio »
    And des bulletins filtrés ou sélectionnés
    When l'administrateur clique sur « Envoyer à Bexio »
    Then un email est envoyé aux adresses configurées avec le fichier Excel en pièce jointe
    And un message de confirmation récapitule le nombre de bulletins et périodes

  Scenario: Empêcher l'envoi sans destinataire
    Given aucune adresse configurée pour les envois Bexio
    When l'administrateur tente l'envoi
    Then une erreur l'invite à compléter la configuration
```

```gherkin
Feature: Paramétrages des salaires
  Scenario: Créer un tarif de salaire
    Given un administrateur accède à l'onglet « Salaires » des paramétrages
    When il ajoute un nouveau tarif avec un nom et un montant
    Then le tarif apparaît dans la liste triée par ordre alphabétique

  Scenario: Mettre à jour un tarif de salaire
    Given un tarif de salaire existant
    When l'administrateur modifie son nom ou son montant
    Then la liste reflète les nouvelles valeurs

  Scenario: Supprimer un tarif de salaire
    Given un tarif de salaire inutilisé
    When l'administrateur confirme la suppression
    Then le tarif disparaît des paramétrages

  Scenario: Préparer l'envoi Bexio
    Given l'administrateur se trouve sur l'onglet « Envois Bexio »
    When il ajoute une adresse email de destination
    Then l'adresse est enregistrée et disponible pour les futurs envois
```
