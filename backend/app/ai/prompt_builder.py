from typing import Dict, Any

def build_negotiation_strategy_prompt(context: Dict[str, Any]) -> str:
    """
    Constructs a structured prompt asking Gemini to generate a negotiation strategy
    and actionable financial advice, formatted as a JSON object.
    """
    loans_str = ""
    for idx, loan in enumerate(context.get("loans", []), 1):
        loans_str += (
            f"{idx}. Lender: {loan['lender_name']} | Type: {loan['loan_type']} | "
            f"Outstanding Amount: ${loan['outstanding_amount']:.2f} | EMI: ${loan['emi']:.2f} | "
            f"Overdue Months: {loan['overdue_months']} | Priority Score: {loan['priority_score']} | "
            f"Priority Level: {loan['priority_level']} | Recommended Settlement: {loan['recommended_settlement_pct']}% "
            f"(${loan['recommended_amount']:.2f}) | Reason: {loan['reason']}\n"
        )

    return f"""
You are a senior financial advisor and debt settlement expert. Generate a comprehensive Debt Negotiation Strategy and actionable Financial Advice for the following client.

=== CLIENT FINANCIAL CONTEXT ===
Client Name: {context['user_name']}
Monthly Income: ${context['monthly_income']:.2f}
Monthly Expenses: ${context['monthly_expenses']:.2f}
Monthly Surplus: ${context['monthly_surplus']:.2f}
Financial Health Score: {context['health_score']}/100
Stress Level: {context['stress_level']}
Debt-to-Income (DTI) Ratio: {context['dti_ratio']:.1f}%
EMI Ratio: {context['emi_ratio']:.1f}%

=== LOAN DETAILS & SETTLEMENT RECOMMENDATIONS ===
{loans_str}

=== STRICT INSTRUCTIONS ===
1. DO NOT perform any mathematical calculations or change any numbers. The numbers above are pre-computed and are the absolute source of truth.
2. Outline a detailed, step-by-step negotiation strategy for each lender, addressing the highest priority loans first.
3. Recommend specific conversational arguments the client can use when speaking with creditors based on the pre-computed reasons.
4. Provide structured, actionable advice on managing the budget, reducing expenses, and rebuilding financial health.
5. Your response MUST be a valid JSON object with exactly two keys: "strategy" (containing the negotiation strategy text in Markdown format) and "financial_advice" (containing the general advice text in Markdown format).
6. Do NOT wrap the JSON in ```json markdown code blocks. Return ONLY the raw JSON object.

Example JSON output format:
{{
  "strategy": "# Step-by-Step Strategy\\n\\n1. **Lender Name**: ...",
  "financial_advice": "# Actionable Financial Advice\\n\\n* **Budgeting**: ..."
}}
"""


def build_settlement_letter_prompt(context: Dict[str, Any], lender_name: str = None) -> str:
    """
    Constructs a prompt asking Gemini to draft a formal debt settlement offer letter.
    """
    loans_str = ""
    for idx, loan in enumerate(context.get("loans", []), 1):
        if not lender_name or lender_name.lower() in loan['lender_name'].lower():
            loans_str += (
                f"- Lender: {loan['lender_name']} | Outstanding Amount: ${loan['outstanding_amount']:.2f} | "
                f"Proposed Settlement Offer: ${loan['recommended_amount']:.2f} (representing {loan['recommended_settlement_pct']}% of outstanding debt) | "
                f"Priority Level: {loan['priority_level']} | Hardship Reason: {loan['reason']}\n"
            )

    target_lender = lender_name if lender_name else "[Lender Name]"

    return f"""
You are a professional legal and financial writer. Draft a formal Debt Settlement Offer Letter for the client.

=== CLIENT Context ===
Client Name: {context['user_name']}
Client Email: {context['user_email']}
Monthly Income: ${context['monthly_income']:.2f}
Monthly Expenses: ${context['monthly_expenses']:.2f}
Monthly Surplus: ${context['monthly_surplus']:.2f}
Financial Stress Level: {context['stress_level']}

=== TARGET LOANS & PROPOSED SETTLEMENTS ===
{loans_str}

=== STRICT INSTRUCTIONS ===
1. DO NOT change or recalculate any amounts or percentages. Use the pre-computed settlement amounts as the absolute offers.
2. Structure the output as a formal, professional legal offer letter from the client to the creditor: {target_lender}.
3. Detail a clear hardship case using the pre-computed context (e.g., monthly surplus of ${context['monthly_surplus']:.2f}, stress level: {context['stress_level']}) to justify why a reduced payout is necessary.
4. Include formal placeholders for dates, account numbers, and signatures.
5. Return ONLY the drafted letter text in clean Markdown format. Do not add any conversational preamble or notes.
"""
