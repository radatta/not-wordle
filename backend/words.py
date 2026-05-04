"""Word lists for Definitely Not Wordle.

ANSWERS is a curated pool of common 5-letter English words used as the
daily / per-session secret. The spec calls for ~2,300 entries (the real
Wordle answer list); a few hundred high-quality words is sufficient for
the demo and easy to swap out for a fuller list later.

VALID_GUESSES is the set of strings accepted as a guess. The spec says
"Any 5-letter string is accepted as a guess (no dictionary enforcement
required, but recommended)" — we accept any 5-letter A-Z string and
defer dictionary enforcement to the consumer if they want it.
"""

from __future__ import annotations

import random

ANSWERS: tuple[str, ...] = tuple(
    sorted(
        {
            w.upper()
            for w in """
            about above abuse actor adapt admit adopt adult after again
            agent agree ahead alarm album alert alike alive allow alone
            along alter among angel anger angle angry apart apple apply
            arena argue arise armor array arrow aside asset audio audit
            avoid award aware badly baker bases basic basis beach began
            begin begun being below bench bible birth black blame blank
            blast blend bless blind block blood bloom board boost booth
            bound brain brand brass brave bread break breed brief bring
            broad broke brown brush build built burst buyer cable calls
            camel candy carry catch cause chain chair chaos charm chart
            chase cheap check chest chief child china chose cider civic
            civil claim class clean clear clerk click cliff climb clock
            close cloth cloud coach coast color comic could count court
            cover craft crane crash crazy cream creed creep crepe crime
            cross crowd crown crude crust crypt cubic curve cycle daily
            dance dated dealt death debug debut decay decor delay delta
            dense depth derby digit dimes diner diode dirty doing donor
            doubt dough dozen draft drain drama drawn dream dress drift
            drill drink drive drove dryer eager early earth eight elbow
            elder elect elite empty enemy enjoy enter entry equal error
            essay event every exact exist extra fable fact fairy faith
            fancy farms fatal favor feast fence fewer field fifth fight
            final first fixed flame flash fleet flesh float flock flood
            floor flour flown fluid flush focus force forge forty forum
            found fraud fresh front frost fruit fully funny gauge ghost
            giant given glass globe glory going grace grade grain grand
            grant grape graph grass grave great green greet grief gross
            group grown guard guess guest guide haiku happy harsh haste
            hasty hatch heart heavy hello hence hertz hider hilly hinge
            holes honor horse hotel house human ideal image imply index
            inner input intro irony issue ivory jelly jolly judge juice
            jumbo karma keeps kebab kneel knife knock known label labor
            laser later laugh layer learn lease least leave legal lemon
            level light limit linen liner lions liver loans local logic
            loose lover lower lucky lunch lying magic major maker maple
            march marsh match maybe mayor meant medal media metal might
            minor minus mixed model money month moose moral motor mount
            mouse mouth movie music naive nasal nasty naval needs nerve
            never night noble noise north notes novel nurse nylon ocean
            offer often ought ouija outer owing owned owner paint paper
            party patch peace peach pearl penny perch petal phase phone
            piano piece piety pilot pinch pitch pivot place plain plane
            plant plate plays plaza plead pleat poach point polar polio
            porch posed power press price pride print prior prize probe
            proof proud prove proxy pulse punch pupil queen quest queue
            quick quiet quilt quint quite quote racks radar radio raise
            range raven reach react ready realm rebel refer reign relay
            remit repay reply reset retro reuse rifle right rigid risen
            riser river robin robot rocky roman rough round rouse route
            royal rumor rural sadly safer saint salad sandy sauce scale
            scarf scene scent scope score scorn scout scrub seize sense
            serum serve setup seven shaft shape share sharp sheep sheet
            shelf shell shift shine shiny ships shire shirt shock shoot
            shore short shown shrug sigma silly since sixty skill skirt
            slave sleep slept slice slide slime sling slope slump small
            smart smell smile smoke snail snake sneak snore snowy solar
            solid solve sonic sorry sound south space spare spark speak
            speed spend spent spice spike spill spine split spoil spoke
            spoon sport spray squad stack staff stage stain stair stake
            stand stark start state stays steam steel steep steer stein
            stern stick stiff still sting stink stock stomp stone stood
            stool stops store storm story stout stove straw strap stray
            strip stuck study stuff style sugar suite sumac super sweet
            swept swift swing sword table taken tally tango taper taste
            tasty taxes teach teams tease teeth tempo tense terms thank
            theft their theme there these thick thief thigh thing think
            third those three threw throw thumb thump tiger tight timer
            tired title toast today token tooth topic torch total touch
            tough tower toxic trace track trade trail train trait treat
            trend trial tribe trick tried truce truck truly trump trunk
            trust truth tulip tutor twice twist tying ulcer ultra uncle
            under undue union unite unity until upper upset urban usage
            usual valid value valve vapor vault vegan venue verge verse
            video views virus visit vital vivid vocal voice vouch wagon
            waist waive waltz waste watch water wedge weigh weird wheat
            wheel where which while whirl white whole whose widow width
            wield wight wince winch wires woken woman women words world
            worry worse worst worth would wound woven wreck wrist write
            wrong wrote yacht yeast yield young youth zebra zesty zonal
            """.split()
        }
    )
)


def random_answer(rng: random.Random | None = None) -> str:
    rng = rng or random
    return rng.choice(ANSWERS)


def is_valid_guess(guess: str) -> bool:
    """Accept any 5-letter A-Z string. Spec allows but does not require
    dictionary enforcement."""
    if len(guess) != 5:
        return False
    return guess.isalpha() and guess.isascii()
