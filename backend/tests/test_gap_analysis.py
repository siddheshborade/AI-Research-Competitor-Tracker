from app.engine.gap_analyzer import gap_analyzer
from app.engine.types import RawSourceItem


def test_research_gap_analysis():
    sources = [
        RawSourceItem(
            title="Multi-Agent Diffusion Diagnostics",
            source="IEEE",
            source_type="research",
            summary="Achieves 99.1% sensitivity on high-VRAM server clusters."
        ),
        RawSourceItem(
            title="Patent US2026/0198421A1",
            source="USPTO",
            source_type="patent",
            summary="Patent covering edge uncertainty estimation."
        )
    ]

    gaps = gap_analyzer.analyze(sources, domain="Medical AI")
    assert len(gaps) >= 1
    gap = gaps[0]
    assert len(gap.area) > 0
    assert len(gap.gap_description) > 0
    assert len(gap.why_it_matters) > 0
    assert len(gap.potential_opportunity) > 0
