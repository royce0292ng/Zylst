"use client"

import {Button, HeroUIProvider, Link} from "@heroui/react";

export default function HomePage() {


    return(
        <HeroUIProvider>
            <header>
                <nav>
                    <strong>Zylst</strong>
                    <ul>
                        <li><a href="#how-it-works">How it Works</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#secret-santa">Secret Santa</a></li>
                        <li>
                            <button>Login</button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>

                <section id="hero">
                    <h1>Stop Guessing. <br/> Start Gifting at the Zenith.</h1>
                    <p>
                        The wishlist platform where your deepest desires meet their perfect match—without spoiling the
                        surprise.
                    </p>

                    <form action="#" method="POST">
                        <label htmlFor="email">Get early access to the Zylst Beta:</label><br/>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required/>
                        <button type="submit">Join the Zenith</button>
                    </form>
                    <p><small>No credit card. No disappointment. Just pure joy.</small></p>
                </section>

                <hr/>

                <section id="problem">
                    <h2>"Oh... you shouldn't have."</h2>
                    <h3>(And you really shouldn't have.)</h3>
                    <p>
                        We’ve all been there. The awkward smile. The fake "thank you." The immediate plan to re-gift.
                        Traditional gifting is a guessing game where everyone loses.
                    </p>
                    <p><strong>Zylst changes the coordinates.</strong></p>
                </section>

                <hr/>

                <section id="how-it-works">
                    <h2>Your Wishes, Curated. Their Choice, Guaranteed.</h2>

                    <div>
                        <h3>1. Aim High</h3>
                        <p>Use the Zylst Scraper to save any item from any corner of the web. Price, photos, and
                            links—all in one place.</p>
                    </div>

                    <div>
                        <h3>2. Share the Map</h3>
                        <p>Send your unique Zylst link to friends and family. No more "what do you want for your
                            birthday?" texts.</p>
                    </div>

                    <div>
                        <h3>3. The Mystery Claim</h3>
                        <p>Friends claim exactly what you want. You’ll see the item is "Reserved" to prevent duplicates,
                            but the giver stays a secret until the big reveal.</p>
                    </div>
                </section>

                <hr/>

                <section id="features">
                    <h2>Engineered for Celebration</h2>

                    <article>
                        <h3>🎡 The Lucky Wheel</h3>
                        <p>Can't decide which gift to pick? Let fate take the lead. Friends can spin the wheel to
                            randomly select a gift from your "Top Tier" wishes.</p>
                    </article>

                    <article>
                        <h3>💌 Blessings Board</h3>
                        <p>More than just a box. A dedicated digital space for friends to leave notes, videos, and "Open
                            Me" messages that unlock on your big day.</p>
                    </article>

                    <article>
                        <h3>🕵️ Secret Santa Mode</h3>
                        <p>Organize group exchanges with zero stress. Automated drawings, anonymous chats, and
                            guaranteed gift success.</p>
                    </article>

                    <article>
                        <h3>📸 Proof of Joy</h3>
                        <p>Scan the Gift QR code at the handover to instantly share a "Thank You" photo with the giver
                            and unlock your Blessings Board.</p>
                    </article>
                </section>

                <hr/>

                <section id="final-cta">
                    <h2>Ready to reach the Zenith?</h2>
                    <p>Join our exclusive community of gift-givers and get your Early Bird "Celestial" Badge.</p>

                    <form action="#" method="POST">
                        <input type="email" name="email_final" placeholder="you@example.com" required/>
                        <button type="submit">Try Zylst Now</button>
                    </form>
                </section>

            </main>

            <footer>
                <p>&copy; 2026 Zylst Inc. Built for better gifting.</p>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">TikTok</a></li>
                </ul>
            </footer>
            <Button radius="md" as={Link}
                    href="/wishlists">
                Try Zylst Now
            </Button>
        </HeroUIProvider>

    )

}
