
<?php

/**
 * @var System $system;
 * @var BattleManager $battleManager
 * @var Battle $battle
 * @var Fighter $player
 * @var Fighter $opponent
 *
 * @var string $self_link
 * @var string $refresh_link
 */

    $health_percent = round(($player->health / $player->max_health) * 100);
    $chakra_percent = round(($player->chakra / $player->max_chakra) * 100);
    $stamina_percent = round(($player->stamina / $player->max_stamina) * 100);
    $player_avatar_size = $player->getAvatarSize() . 'px';

    $opponent_health_percent = round(($opponent->health / $opponent->max_health) * 100);
    $opponent_avatar_size = $opponent->getAvatarSize() . 'px';

    $battle_text = null;
    if($battle->battle_text) {
        $battle_text = $system->html_parse(stripslashes($battle->battle_text));
        $battle_text = str_replace(array('[br]', '[hr]'), array('<br />', '<hr />'), $battle_text);
    }

    require 'templates/battle/resource_bar.php';
?>

<style type='text/css'>
    .fighterDisplay {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
    .fighterDisplay.opponent {
        flex-direction: row-reverse;
    }
    .avatarContainer {
        width: 100px;
        height: 100px;

        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.1);
    }
    .playerAvatar {
        display:block;
        margin: auto;
        max-width:<?= $player_avatar_size ?>;
        max-height:<?= $player_avatar_size ?>;
    }
    .opponentAvatar {
        display:block;
        margin:auto;
        max-width:<?= $opponent_avatar_size ?>;
        max-height:<?= $opponent_avatar_size ?>;
    }
</style>

<div class='submenu'>
    <ul class='submenu'>
        <li style='width:100%;'><a href='<?= $refresh_link ?>'>Refresh Battle</a></li>
    </ul>
</div>
<div class='submenuMargin'></div>

<?php $system->printMessage(); ?>

<!-- PLAYER DISPLAYS -->
<table class='table'>
    <tr>
        <th style='width:50%;'>
            <a href='<?= $system->links['members'] ?>&user=<?= $player->getName() ?>'
               style='text-decoration:none'
            >
                <?= $player->getName() ?>
            </a>
        </th>
        <th style='width:50%;'>
            <?php if($opponent instanceof NPC): ?>
                <?= $opponent->getName() ?>
            <?php else: ?>
                <a href='<?= $system->links['members'] ?>&user=<?= $opponent->getName() ?>'
                   style='text-decoration:none'
                >
                    <?= $opponent->getName() ?>
                </a>
            <?php endif; ?>
        </th>
    </tr>
    <tr><td>
        <div class='fighterDisplay'>
            <div class='avatarContainer'>
                <img src='<?= $player->avatar_link ?>' class='playerAvatar' />
            </div>
            <div class='resourceBars'>
                <?php resourceBar($player->health, $player->max_health, 'health') ?>
                <?php if(!$battleManager->spectate): ?>
                    <?php resourceBar($player->chakra, $player->max_chakra, 'chakra') ?>
                <?php endif; ?>
            </div>
        </div>
    </td>
    <td>
        <div class='fighterDisplay opponent'>
            <div class='avatarContainer'>
                <img src='<?= $opponent->avatar_link ?>' class='opponentAvatar' />
            </div>
            <div class='resourceBars'>
                <?php resourceBar($opponent->health, $opponent->max_health,'health') ?>
            </div>
        </div>
    </td></tr>
    <!-- Battle field -->
    <tr><td colspan='2'>
        <?php require 'templates/battle/battle_field.php'; ?>
    </td></tr>
</table>

<table class='table'>
    <!--// Battle text display-->
    <?php if($battle_text): ?>
        <tr><th colspan='2'>Last turn</th></tr>
        <tr><td style='text-align:center;' colspan='2'><?= $battle_text ?></td></tr>
    <?php endif; ?>

    <!--// Trigger win action or display action prompt-->
    <?php if(!$battle->isComplete() && !$battleManager->spectate): ?>
        <tr><th colspan='2'>Select Action</th></tr>

        <?php if(!$battleManager->playerActionSubmitted()): ?>
            <?php require 'templates/battle/action_prompt.php'; ?>
        <?php elseif(!$battleManager->opponentActionSubmitted()): ?>
            <tr><td colspan='2'>Please wait for <?= $opponent->getName() ?> to select an action.</td></tr>
        <?php endif; ?>

        <!--// Turn timer-->
        <tr><td style='text-align:center;' colspan='2'>
            <?= ($battle->isPreparationPhase() ? "Prep-" : "") ?>Time remaining:
                <?= $battle->isPreparationPhase() ? $battle->prepTimeRemaining() : $battle->timeRemaining() ?> seconds
        </td></tr>
    <?php endif; ?>

    <?php if($battleManager->spectate): ?>
        <tr><td style='text-align:center;' colspan='2'>
            <?php if($battle->winner == Battle::TEAM1): ?>
               <?=  $battle->player1->getName() ?> won!
            <?php elseif($battle->winner == Battle::TEAM2): ?>
                <?= $battle->player2->getName() ?> won!
            <?php elseif($battle->winner == Battle::DRAW): ?>
                Fight ended in a draw.
            <?php else: ?>
                Time remaining: <?= $battle->timeRemaining() ?> seconds
            <?php endif; ?>
        </td></tr>
    <?php endif; ?>
</table>