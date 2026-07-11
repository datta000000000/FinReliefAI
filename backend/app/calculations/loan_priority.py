from typing import Tuple

def calculate_priority_score(
    overdue_months: int,
    interest_rate: float,
    outstanding_amount: float,
    emi: float
) -> float:
    """
    Calculate a deterministic loan priority score between 0 and 100.
    Weights:
    - Overdue Months: 35%
    - Interest Rate: 25%
    - Outstanding Amount: 20%
    - Monthly EMI: 20%
    """
    # 1. Overdue Months Component (35%)
    if overdue_months <= 0:
        overdue_score = 0.0
    elif overdue_months == 1:
        overdue_score = 30.0
    elif overdue_months == 2:
        overdue_score = 60.0
    else:
        overdue_score = 100.0

    # 2. Interest Rate Component (25%)
    # Reference max interest rate of 30.0%
    interest_score = min(100.0, max(0.0, (interest_rate / 30.0) * 100.0))

    # 3. Outstanding Amount Component (20%)
    # Reference max outstanding amount of 50,000
    outstanding_score = min(100.0, max(0.0, (outstanding_amount / 50000.0) * 100.0))

    # 4. EMI Component (20%)
    # Reference max EMI of 2,000
    emi_score = min(100.0, max(0.0, (emi / 2000.0) * 100.0))

    # Weighted Sum
    priority_score = (
        (overdue_score * 0.35) +
        (interest_score * 0.25) +
        (outstanding_score * 0.20) +
        (emi_score * 0.20)
    )

    return round(max(0.0, min(100.0, priority_score)), 2)


def classify_priority_level(score: float) -> str:
    """
    Classify priority score into High, Medium, or Low.
    """
    if score >= 75.0:
        return "High"
    elif score >= 40.0:
        return "Medium"
    else:
        return "Low"


def generate_settlement_recommendation(
    outstanding_amount: float,
    health_score: float,
    priority_score: float,
    monthly_surplus: float
) -> Tuple[float, float, str]:
    """
    Generates a deterministic settlement recommendation.
    Returns:
        (Recommended Settlement Percentage, Recommended Settlement Amount, Reason)
    """
    # Base settlement percentage based on Financial Health Score
    if health_score < 40.0:
        base_pct = 40.0
        health_status = "Critical financial stress"
    elif health_score < 80.0:
        base_pct = 50.0
        health_status = "Moderate financial profile"
    else:
        base_pct = 60.0
        health_status = "Stable financial indicators"

    # Adjust based on loan priority score (deduct up to 10% for high priority to recommend a more aggressive settlement)
    priority_adjustment = (priority_score / 100.0) * 10.0
    recommended_pct = base_pct - priority_adjustment

    # Clamp the percentage between 30% and 70%
    recommended_pct = round(max(30.0, min(70.0, recommended_pct)), 2)
    recommended_amount = round(outstanding_amount * (recommended_pct / 100.0), 2)

    # Determine reason text based on health status and priority level
    priority_level = classify_priority_level(priority_score)
    if priority_level == "High":
        reason = (
            f"{health_status} (Score: {health_score:.1f}, Surplus: {monthly_surplus:.2f}). "
            f"Highly aggressive {recommended_pct}% settlement recommended for this High priority loan to prevent default."
        )
    elif priority_level == "Medium":
        reason = (
            f"{health_status}. Recommended {recommended_pct}% settlement to "
            f"restructure this Medium priority debt and improve cash flow."
        )
    else:
        reason = (
            f"{health_status}. Recommended {recommended_pct}% settlement for "
            f"low-impact clearance of this Low priority debt."
        )

    return recommended_pct, recommended_amount, reason
