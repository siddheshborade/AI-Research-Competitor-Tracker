from fastapi.testclient import TestClient


def test_full_agentic_workflow_end_to_end(client: TestClient):
    # 1. USER OBJECTIVE -> Create and auto-execute research
    create_payload = {
        "title": "Evaluate OmniHealth Autonomous Medical AI Diagnostic Suite",
        "description": "Investigate patent claims, clinical validation benchmarks, FDA clearances, and pricing strategy for OmniHealth Labs.",
        "domain": "Medical AI",
        "target_competitors": ["OmniHealth Labs"],
        "depth": "standard"
    }
    create_res = client.post("/api/research", json=create_payload)
    assert create_res.status_code == 201
    created_data = create_res.json()["data"]
    obj_id = created_data["objective"]["id"]
    assert created_data["objective"]["status"] == "completed"
    assert created_data["latest_run"]["status"] == "completed"
    assert created_data["sources_scanned_count"] >= 3
    assert created_data["insights_count"] >= 2

    # 2. GET RESEARCH DETAILS
    get_res = client.get(f"/api/research/{obj_id}")
    assert get_res.status_code == 200
    research_detail = get_res.json()["data"]
    assert research_detail["objective"]["id"] == obj_id
    assert len(research_detail["insights"]) >= 2

    # 3. GET SAFE EXECUTION TRACE (Demo / Judging transparency)
    trace_res = client.get(f"/api/research/{obj_id}/trace")
    assert trace_res.status_code == 200
    trace_steps = trace_res.json()["data"]
    assert len(trace_steps) >= 2
    for step in trace_steps:
        assert "step" in step
        assert "action" in step
        assert "tool_selected" in step
        assert "tool_rationale" in step
        assert "result_count" in step

    # 4. GET RESEARCH EVIDENCE GRAPH
    graph_res = client.get(f"/api/research/{obj_id}/graph")
    assert graph_res.status_code == 200
    graph_data = graph_res.json()["data"]
    assert len(graph_data["nodes"]) >= 2
    assert len(graph_data["edges"]) >= 1

    # 5. QUERY INSIGHTS (WHAT -> WHY -> SO WHAT)
    insights_res = client.get(f"/api/insights?objective_id={obj_id}")
    assert insights_res.status_code == 200
    insights = insights_res.json()["data"]
    assert len(insights) >= 2
    target_insight = insights[0]
    assert len(target_insight["what_description"]) > 15
    assert len(target_insight["why_description"]) > 15
    assert len(target_insight["so_what_description"]) > 15
    assert target_insight["confidence_score"] > 0.60

    # 6. HUMAN VERIFICATION GATE
    ver_payload = {
        "insight_id": target_insight["id"],
        "reviewer_name": "Chief Medical Strategist",
        "reviewer_role": "Domain Expert",
        "status": "verified",
        "notes": "Corroborated timeline divergence against latest SEC 10-Q filing.",
        "confidence_adjustment": 0.05
    }
    ver_res = client.post("/api/verification", json=ver_payload)
    assert ver_res.status_code == 201
    assert ver_res.json()["data"]["status"] == "verified"

    # Verify insight status updated to approved
    ins_check = client.get(f"/api/insights/{target_insight['id']}")
    assert ins_check.status_code == 200
    assert ins_check.json()["data"]["status"] == "approved"

    # 7. DASHBOARD SUMMARY AGGREGATION
    dash_res = client.get("/api/dashboard/summary")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()["data"]
    assert dash_data["stats"]["total_objectives"] >= 1
    assert dash_data["stats"]["total_evidence_nodes"] >= 3
    assert dash_data["stats"]["total_insights"] >= 2
