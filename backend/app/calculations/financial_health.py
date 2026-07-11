def calculate_monthly_surplus(income: float, expenses: float, total_emi: float) -> float:
    """
    Calculate Monthly Surplus.
    Formula: Monthly Income - (Monthly Expenses + Total EMI)
    """
    return income - (expenses + total_emi)


def calculate_emi_ratio(total_emi: float, income: float) -> float:
    """
    Calculate EMI Ratio.
    Formula: (Total EMI / Monthly Income) * 100
    Handles division by zero.
    """
    if income <= 0:
        return 100.0 if total_emi > 0 else 0.0
    return (total_emi / income) * 100


def calculate_dti_ratio(total_outstanding_debt: float, income: float) -> float:
    """
    Calculate Debt-to-Income (DTI) Ratio.
    Formula: (Total Outstanding Debt / (Monthly Income * 12)) * 100
    Handles division by zero.
    """
    annual_income = income * 12
    if annual_income <= 0:
        return 100.0 if total_outstanding_debt > 0 else 0.0
    return (total_outstanding_debt / annual_income) * 100


def calculate_health_score(
    emi_ratio: float,
    dti_ratio: float,
    monthly_surplus: float,
    total_outstanding_debt: float,
    income: float
) -> float:
    """
    Calculate Financial Health Score between 0 and 100 based on weighted metrics:
    - EMI Ratio Score (30%)
    - DTI Ratio Score (30%)
    - Monthly Surplus Score (20%)
    - Debt Multiplier (20%)
    """
    # 1. EMI Ratio Score Component (30%)
    # Ideal: <= 15%, Critical: >= 50%
    if emi_ratio <= 15.0:
        emi_score = 100.0
    elif emi_ratio >= 50.0:
        emi_score = 0.0
    else:
        emi_score = 100.0 - ((emi_ratio - 15.0) * (100.0 / 35.0))

    # 2. DTI Ratio Score Component (30%)
    # Ideal: <= 20%, Critical: >= 100%
    if dti_ratio <= 20.0:
        dti_score = 100.0
    elif dti_ratio >= 100.0:
        dti_score = 0.0
    else:
        dti_score = 100.0 - ((dti_ratio - 20.0) * (100.0 / 80.0))

    # 3. Monthly Surplus Score Component (20%)
    # Ideal: Surplus >= 30% of income, Critical: Surplus <= 0%
    if income <= 0:
        surplus_score = 0.0
    else:
        surplus_pct = (monthly_surplus / income) * 100
        if surplus_pct >= 30.0:
            surplus_score = 100.0
        elif surplus_pct <= 0.0:
            surplus_score = 0.0
        else:
            surplus_score = (surplus_pct / 30.0) * 100.0

    # 4. Debt Multiplier Score Component (20%)
    # Ideal: Outstanding Debt <= 1 month of income, Critical: >= 12 months
    if income <= 0:
        debt_score = 0.0 if total_outstanding_debt > 0 else 100.0
    else:
        debt_multiplier = total_outstanding_debt / income
        if debt_multiplier <= 1.0:
            debt_score = 100.0
        elif debt_multiplier >= 12.0:
            debt_score = 0.0
        else:
            debt_score = 100.0 - ((debt_multiplier - 1.0) * (100.0 / 11.0))

    # Weighted Average Calculation
    total_score = (
        (emi_score * 0.3) +
        (dti_score * 0.3) +
        (surplus_score * 0.2) +
        (debt_score * 0.2)
    )

    # Clamp the final score strictly between 0.0 and 100.0
    clamped_score = max(0.0, min(100.0, total_score))
    return round(clamped_score, 2)


def calculate_stress_level(score: float) -> str:
    """
    Categorize Financial Stress Level.
    Score >= 80 -> Low
    60-79 -> Moderate
    40-59 -> High
    Below 40 -> Critical
    """
    if score >= 80.0:
        return "Low"
    elif score >= 60.0:
        return "Moderate"
    elif score >= 40.0:
        return "High"
    else:
        return "Critical"
