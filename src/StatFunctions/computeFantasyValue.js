import { computeLeagueAverage } from './computeLeagueAverage'

export function computeFantasyValue(playerStatAverages, categories) {

  let leagueAverages = computeLeagueAverage(playerStatAverages)
  let fantasyValuesArray = []

  for (const player in playerStatAverages) {
    let cP = playerStatAverages[player]
    let playerFantasyValue = {
      name: cP.name,
      nba_team_id: cP.nba_team_id,
      position: cP.position,
      fNba_mins: fantasyValueCaddy(cP, leagueAverages, "avg_mins"),
      fNba_fgm: fantasyValueCaddy(cP, leagueAverages, "avg_fgm"),
      fNba_fga: fantasyValueCaddy(cP, leagueAverages, "avg_fga"),
      fNba_fgp: fantasyValueCaddy(cP, leagueAverages, "fgp"),
      fNba_ftm: fantasyValueCaddy(cP, leagueAverages, "avg_ftm"),
      fNba_fta: fantasyValueCaddy(cP, leagueAverages, "avg_fta"),
      fNba_ftp: fantasyValueCaddy(cP, leagueAverages, "ftp"),
      fNba_tpm: fantasyValueCaddy(cP, leagueAverages, "avg_tpm"),
      fNba_tpa: fantasyValueCaddy(cP, leagueAverages, "avg_tpa"),
      fNba_tpp: fantasyValueCaddy(cP, leagueAverages, "tpp"),
      fNba_off_reb: fantasyValueCaddy(cP, leagueAverages, "avg_off_reb"),
      fNba_def_reb: fantasyValueCaddy(cP, leagueAverages, "avg_def_reb"),
      fNba_tot_reb: fantasyValueCaddy(cP, leagueAverages, "avg_tot_reb"),
      fNba_assists: fantasyValueCaddy(cP, leagueAverages, "avg_assists"),
      fNba_steals: fantasyValueCaddy(cP, leagueAverages, "avg_steals"),
      fNba_blocks: fantasyValueCaddy(cP, leagueAverages, "avg_blocks"),
      fNba_turnovers: fantasyValueCaddy(cP, leagueAverages, "avg_turnovers"),
      fNba_plus_minus: fantasyValueCaddy(cP, leagueAverages, "avg_plus_minus"),
      fNba_p_fouls: fantasyValueCaddy(cP, leagueAverages, "avg_p_fouls"),
      fNba_points: fantasyValueCaddy(cP, leagueAverages, "avg_points"),
    }
    playerFantasyValue.fNba_score = fantasyAggregate(playerFantasyValue, categories)
    fantasyValuesArray.push(playerFantasyValue)
  }
  return fantasyValuesArray
}

function fantasyValueCaddy(currentPlayer, leagueAverages, stat) {
  let valMod = valueModifier(stat)
  switch (stat) {
    case "fgp":
      let statVal1 = (currentPlayer[stat] / (leagueAverages[stat] * valMod)) - 1
      let modded1 = statVal1 * (currentPlayer["avg_fga"] / leagueAverages["avg_fga"])
      return parseFloat(modded1.toFixed(2))
    case "ftp":
      let statVal2 = (currentPlayer[stat] / (leagueAverages[stat] * valMod)) - 1
      let modded2 = statVal2 * (currentPlayer["avg_fta"] / leagueAverages["avg_fta"])
      return parseFloat(modded2.toFixed(2))
    default:
      let statVal3 = (currentPlayer[stat] / (leagueAverages[stat] * valMod)) - 1
      return parseFloat(statVal3.toFixed(2))
  }
}

function fantasyAggregate(playerObj, categories) {
  let aggregateValue = []
  for (const category in categories) {
    if (categories[category]) {
      aggregateValue.push(playerObj[category])
    }
  }
  return parseFloat((aggregateValue.reduce((tot, val) => tot + val) / aggregateValue.length).toFixed(2))
}

function valueModifier(stat) {
  switch (stat) {
    case "points" || "tot_rebs":
      return 0.67
    case "steals":
      return 0.75
    default:
      return 1.0
  }
}
