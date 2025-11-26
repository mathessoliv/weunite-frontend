import { Opportunity } from "@/pages/opportunity/Opportunity";
import { MyOpportunities } from "@/pages/opportunity/MyOpportunities";
import { OpportunitySubscribersPage } from "@/pages/opportunity/OpportunitySubscribersPage";
import SavedOpportunitiesPage from "@/pages/opportunity/SavedOpportunitiesPage";
import { Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "../PrivateRoutes";

export function OpportunityRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Opportunity />} />
        <Route path="/my-opportunities" element={<MyOpportunities />} />
        <Route path="/saved" element={<SavedOpportunitiesPage />} />
        <Route
          path="/:opportunityId/subscribers"
          element={<OpportunitySubscribersPage />}
        />
      </Route>
    </Routes>
  );
}
