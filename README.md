NHL Ice-Arbitrage: Scalable League-Wide Analytics Platform (V2)
Project Vision

A professional-grade data aggregation and financial analysis platform for NHL ticketing. This tool identifies market inefficiencies and "Deal Scores" across all 32 NHL arenas by aggregating multiple data sources and normalizing pricing across international currencies (USD/CAD).

This project is a primary training ground for Product Management Architecture, focusing on building extensible systems that can handle multiple third-party integrations and evolving data parameters.
PM & Architectural Principles

    The Adapter Pattern: To prevent technical debt, each ticket source (SeatGeek, Ticketmaster, etc.) must use a dedicated adapter to pipe data into a unified schema.
    Extensibility First: The data model is designed to be "additive." New fields (e.g., Team Standings, Weather, Travel Distance) can be added without refactoring the core engine.
    Currency Agnostic: All financial data is processed through a conversion layer to support the dual-nation nature of the NHL.

Core Feature Set (V2)

    Multi-Source Aggregation: Scalable architecture to support SeatGeek (v1) and future providers (v2+).
    Dual-Currency Engine: Real-time USD/CAD conversion for all price points (Lowest, Average, and Highest).
    Extreme Metric Tracking: - The Whale Watch: Identifies the single most expensive ticket currently listed in the league.
        The Floor Tracker: Identifies the literal cheapest entry point into any NHL game globally.
    The Arbitrage Engine: Calculates the "Deal Score" (Discount % relative to game average) to find "steals" in high-demand markets like Buffalo/Toronto.
    League Leaderboard: All 32 teams ranked from most expensive to least expensive based on live average ticket prices.

Technical Stack

    Frontend: Next.js (App Router) / React
    Styling: Tailwind CSS + Headless UI
    State Management: TypeScript Interfaces (Strict Type Safety)
    APIs: SeatGeek Platform API + ExchangeRate-API (for currency normalization).

Current Roadmap
Sprint 1: Scalable Foundation (Current)

    Define the NHL_Game and PriceObject interfaces.
    Build the Currency Conversion Service (USD <-> CAD).
    Implement the first API Adapter (SeatGeek).
    Create the "Master Table" UI with sortable columns and currency toggle.

Sprint 2: Global Analytics

    Implement the "Extreme Metrics" logic (League Max/Min).
    Build the "League Leaderboard" summary view.
    Refine the "Deal Score" logic to include fee-estimation.

Sprint 3: Advanced Parameters

    Add "Matchup Strength" parameter (API pull for team rankings).
    Implement "Travel Distance" logic for road-trip planning.
    Add "Bonus-Buy" simulation (Net worth impact of spending vs. investing).

Managed by Jules (AI Developer) under the direction of the Product Lead.
