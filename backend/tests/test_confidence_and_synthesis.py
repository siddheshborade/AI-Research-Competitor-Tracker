from app.engine.confidence_calculator import confidence_calculator
from app.engine.synthesis import synthesizer
from app.engine.types import RawSourceItem, ContradictionRecord


def test_explainable_confidence_formula():
    sources = [
        RawSourceItem(
            title="SEC Form 10-Q",
            source="SEC EDGAR",
            source_type="sec_filing",
            summary="Item 2 Disclosures",
            reliability=0.99
        ),
        RawSourceItem(
            title="USPTO Patent",
            source="USPTO",
            source_type="patent",
            summary="Claims 1-18",
            reliability=0.96
        )
    ]
    conf = confidence_calculator.calculate(sources, [])
    assert conf.final_confidence >= 0.85
    assert conf.source_quality_score >= 0.90
    assert conf.agreement_score == 1.0
    assert "Confidence" in conf.explanation
    assert "Quality" in conf.explanation


def test_confidence_penalized_by_contradiction():
    sources = [
        RawSourceItem(
            title="News PR",
            source="PR Wire",
            source_type="news",
            summary="Claims launch",
            reliability=0.88
        ),
        RawSourceItem(
            title="SEC 10-Q",
            source="SEC EDGAR",
            source_type="sec_filing",
            summary="Discloses delay",
            reliability=0.99
        )
    ]
    contra = ContradictionRecord(
        id="c1",
        claim_a="Claims launch",
        source_a_title="News PR",
        source_a_type="news",
        claim_b="Discloses delay",
        source_b_title="SEC 10-Q",
        source_b_type="sec_filing",
        conflict_explanation="Direct timeline contradiction",
        requires_human_verification=True
    )
    conf_with_contra = confidence_calculator.calculate(sources, [contra])
    assert conf_with_contra.agreement_score < 1.0


def test_synthesis_what_why_so_what():
    sources = [
        RawSourceItem(
            title="Patent US2026/0198421A1",
            source="USPTO",
            source_type="patent",
            summary="Claims on uncertainty scoring.",
            extracted_facts={"patent_number": "US2026/0198421A1"}
        )
    ]
    insights = synthesizer.synthesize(
        objective="Analyze competitor patent moat",
        domain="Medical AI",
        sources=sources,
        contradictions=[],
        weak_signals=[],
        gaps=[],
        target_competitors=["OmniHealth Labs"]
    )
    assert len(insights) >= 1
    ins = insights[0]
    # Check WHAT -> WHY -> SO WHAT
    assert len(ins.what) > 20
    assert len(ins.why) > 20
    assert len(ins.so_what) > 20
    assert ins.classification in ["Opportunity", "Threat", "Neutral"]
    assert ins.action_recommendation is not None
