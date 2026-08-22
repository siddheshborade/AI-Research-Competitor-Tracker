from app.engine.contradiction_detector import contradiction_detector
from app.engine.types import RawSourceItem


def test_contradiction_detection():
    news_source = RawSourceItem(
        title="OmniHealth Announces Q3 Clearance",
        source="Tech Wire",
        source_type="news",
        summary="OmniHealth claims FDA 510(k) clearance by Q3 2026.",
        extracted_facts={"claimed_fda_clearance_date": "Q3 2026", "event_type": "commercial_launch"}
    )
    sec_source = RawSourceItem(
        title="OmniHealth Form 10-Q Filing",
        source="SEC EDGAR",
        source_type="sec_filing",
        summary="Discloses regulatory clearance delayed into FY2027.",
        extracted_facts={"regulatory_risk_disclosure": "Fiscal Year 2027 delay", "projected_commercial_revenue_date": "FY 2027"}
    )

    contradictions = contradiction_detector.detect([news_source, sec_source])
    assert len(contradictions) >= 1
    c = contradictions[0]
    assert c.requires_human_verification is True
    assert "Q3" in c.claim_a
    assert "2027" in c.claim_b
    assert c.severity == "high"


def test_no_contradiction_when_sources_agree():
    s1 = RawSourceItem(
        title="Paper A",
        source="arXiv",
        source_type="research",
        summary="Reports 98% accuracy.",
        extracted_facts={"accuracy": "98%"}
    )
    s2 = RawSourceItem(
        title="Paper B",
        source="IEEE",
        source_type="research",
        summary="Confirms 98.2% accuracy.",
        extracted_facts={"accuracy": "98.2%"}
    )
    contradictions = contradiction_detector.detect([s1, s2])
    assert len(contradictions) == 0
