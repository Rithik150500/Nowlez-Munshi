from tests._helpers import make_user_with_cases

from munshi_core import ask_munshi


def test_ask_munshi_extractive_finds_case(db):
    user = make_user_with_cases(db, "+919700000001", with_munshi_origin=False)

    res = ask_munshi(user, "When is the next hearing in Sharma?", session=db, channel="web")

    assert res.mode == "extractive"  # no GEMINI_API_KEY in tests
    assert "DLHC010012342024" in res.text
    assert "2026-06-15" in res.text
    assert any(c.cnr == "DLHC010012342024" for c in res.citations)


def test_ask_munshi_no_cases(db):
    from data_access.daos import user_dao

    user, _ = user_dao.get_or_create_by_phone(db, phone="+919700000002")
    db.commit()

    res = ask_munshi(user, "anything?", session=db, channel="web")
    assert "no cases" in res.text.lower()
    assert res.citations == []
