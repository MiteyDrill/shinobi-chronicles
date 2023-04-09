<?php
/**
 * @param System $system
 * @param User $player
 */
?>

<link rel="stylesheet" type="text/css" href="ui_components/src/travel/Travel.css" />
<div id="travelContainer"></div>
<script type="module" src="<?= $system->link ?><?= $system->getReactFile("travel/Travel") ?>"></script>
<script>
    const travelContainer = document.querySelector("#travelContainer");
    const travelPageLink = "<?= $system->links['travel'] ?>";
    const travelAPILink = "<?= $system->api_links['travel'] ?>";

    window.addEventListener('load', () => {
        ReactDOM.render(
            React.createElement(Travel, {
                travelAPILink: travelAPILink,
                travelPageLink: travelPageLink,
                missionLink: "<?= $system->links['mission'] ?>",
                membersLink: "<?= $system->links['members'] ?>",
                attackLink: "<?= $system->links['battle'] ?>",
                self_id: <?= $player->user_id ?>,
                playerRank: <?= $player->rank_num ?>
            }),
            travelContainer
        );
    });
</script>