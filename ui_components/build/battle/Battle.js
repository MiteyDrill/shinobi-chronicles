import { FighterDisplay } from "./FighterDisplay.js";
import { BattleField } from "./BattleField.js";

function Battle({
  battle,
  membersLink
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FightersAndField, {
    player: battle.fighters[battle.playerId],
    opponent: battle.fighters[battle.opponentId],
    isSpectating: false,
    fighters: battle.fighters,
    field: battle.field,
    membersLink: membersLink
  }));
}

function FightersAndField({
  player,
  opponent,
  membersLink,
  isSpectating,
  fighters,
  field
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: "table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: "50%"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: `${membersLink}}&user=${player.name}`,
    style: {
      textDecoration: "none"
    }
  }, player.name)), /*#__PURE__*/React.createElement("th", {
    style: {
      width: "50%"
    }
  }, opponent.isNpc ? opponent.name : /*#__PURE__*/React.createElement("a", {
    href: `${membersLink}}&user=${opponent.name}`,
    style: {
      textDecoration: "none"
    }
  }, opponent.name))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FighterDisplay, {
    fighter: player,
    showChakra: isSpectating
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(FighterDisplay, {
    fighter: opponent,
    isOpponent: true,
    showChakra: false
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, /*#__PURE__*/React.createElement(BattleField, {
    fighters: fighters,
    tiles: field.tiles
  })))));
}

window.Battle = Battle;