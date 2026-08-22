from app.engine.weak_signal_detector import weak_signal_detector
from app.engine.types import RawSourceItem


def test_weak_signal_detection():
    sources = [
        RawSourceItem(
            title="Research on Federated Cross-Attention",
            source="arXiv",
            source_type="research",
            summary="Preprint exploring privacy-preserving edge models."
        ),
        RawSourceItem(
            title="US2026/0198421A1 Patent Application",
            source="USPTO",
            source_type="patent",
            summary="Patent on real-time uncertainty scoring on edge devices."
        ),
        RawSourceItem(
            title="Careers Portal: AI Compliance Engineers",
            source="Careers",
            source_type="job_posting",
            summary="Hiring 32 new clinical AI compliance engineers."
        )
    ]

    signals = weak_signal_detector.detect(sources, domain="Medical AI")
    assert len(signals) >= 1
    assert any("Federated" in s.signal_title or "Compliance" in s.signal_title for s in signals)
    assert signals[0].confidence > 0.70
    assert signals[0].trend_direction in ["emerging", "accelerating"]
