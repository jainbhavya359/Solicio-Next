#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <cctype>
#include <iterator>

#include "json.hpp"

using namespace std;
using json = nlohmann::json;

/* ---------------- STOPWORDS ---------------- */
unordered_set<string> STOPWORDS = {
    "the", "is", "of", "and", "to", "in"
};

/* ---------------- HELPERS ---------------- */
string normalize(string s) {
    transform(s.begin(), s.end(), s.begin(),
              [](unsigned char c) { return tolower(c); });
    return s;
}

vector<string> tokenize(const string& s) {
    vector<string> tokens;
    string cur;

    for (char c : s) {
        if (isalnum(c)) {
            cur += tolower(c);
        } else {
            if (!cur.empty() && !STOPWORDS.count(cur)) {
                tokens.push_back(cur);
            }
            cur.clear();
        }
    }
    if (!cur.empty() && !STOPWORDS.count(cur))
        tokens.push_back(cur);

    return tokens;
}

/* ---------------- MAIN ---------------- */
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Read full stdin
    string input((istreambuf_iterator<char>(cin)), {});
    if (input.empty()) return 0;

    json payload = json::parse(input);

    string query = normalize(payload["query"].get<string>());
    auto docs = payload["docs"];

    vector<string> qTokens = tokenize(query);

    unordered_map<string, int> scores;

    for (auto& doc : docs) {
        string id = doc["id"].get<string>();

        string party   = normalize(doc["partyName"].get<string>());
        string item    = normalize(doc["itemName"].get<string>());
        string date    = normalize(doc["date"].get<string>());
        string voucher = normalize(doc["voucherType"].get<string>());

        int score = 0;

        for (const auto& token : qTokens) {
            if (party.find(token) != string::npos)   score += 10;
            if (item.find(token) != string::npos)    score += 8;
            if (date.find(token) != string::npos)    score += 6;
            if (voucher.find(token) != string::npos) score += 3;
        }

        // Strong exact-token boosts
        for (const auto& token : qTokens) {
            if (party == token) score += 20;
            if (item == token)  score += 15;
        }

        if (score > 0)
            scores[id] = score;
    }

    vector<json> results;
    for (auto& [id, s] : scores) {
        results.push_back({
            {"id", id},
            {"score", s}
        });
    }

    sort(results.begin(), results.end(),
        [](const json& a, const json& b) {
            return a["score"].get<int>() > b["score"].get<int>();
        });

    if (results.size() > 20)
        results.resize(20);

    json output;
    output["results"] = results;

    cout << output.dump();
    return 0;
}
