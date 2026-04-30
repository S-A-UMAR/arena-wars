def calculate_elo_change(winner_elo, loser_elo, k_factor=32):
    """
    Standard Elo rating calculation.
    """
    expected_winner = 1 / (1 + 10 ** ((loser_elo - winner_elo) / 400))
    expected_loser = 1 / (1 + 10 ** ((winner_elo - loser_elo) / 400))
    
    new_winner_elo = winner_elo + k_factor * (1 - expected_winner)
    new_loser_elo = loser_elo + k_factor * (0 - expected_loser)
    
    return round(new_winner_elo), round(new_loser_elo)

def calculate_combat_power(stats):
    """
    Custom algorithm to calculate combat power based on performance.
    """
    kills = stats.get('kills', 0)
    deaths = stats.get('deaths', 0)
    assists = stats.get('assists', 0)
    gold = stats.get('gold', 0)
    mvp = 1.2 if stats.get('is_mvp', False) else 1.0
    
    kda = (kills + assists) / max(1, deaths)
    power = (kda * 100) + (gold / 100)
    return round(power * mvp)
