-- Create a database if not exists
CREATE DATABASE IF NOT EXISTS BookNotes;

-- This one if you already have a table in this name or just want to rewrite the table
DROP TABLE IF EXISTS notes;


-- Creating a table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    isbn VARCHAR(15),
    cover_id VARCHAR(15),
    published_year VARCHAR(15),
    rating INTEGER,
    review TEXT
);

-- Inserting values
INSERT INTO notes (title, isbn, cover_id, published_year, rating, review)
VALUES ('Rich Dad, Poor Dad', '9784480863300', '8315603', '1990', '8', 'Nulla auctor quam quis orci consequat, ac tempor sapien pharetra. Morbi facilisis lacinia ornare. Sed magna turpis, elementum 
vel nulla id, hendrerit tincidunt leo. Suspendisse finibus sem pharetra orci sagittis congue. Curabitur augue justo, cursus at ipsum 
et, elementum aliquet erat. Duis congue malesuada sem, at bibendum eros porta in. Morbi eu blandit dui. Vestibulum suscipit 
consequat ante, nec varius erat mattis sit amet.

Donec accumsan, elit ut scelerisque ultricies, leo tellus imperdiet mauris, in vestibulum leo enim sit amet augue. Nullam posuere 
neque vestibulum nunc pellentesque, ut consequat quam sagittis. Sed metus diam, fringilla sit amet libero nec, tempor tristique 
leo. Suspendisse enim ex, pulvinar non sapien quis, pharetra pretium est. Donec semper mauris ut convallis facilisis. Phasellus eu 
blandit eros. In hac habitasse platea dictumst.

Maecenas tempus arcu ut nulla rhoncus, ut venenatis lectus mattis. Sed molestie tincidunt nunc at malesuada. Nam sagittis leo 
dui, at laoreet lorem aliquam porttitor. Curabitur ultricies accumsan nulla, vel porta tortor consectetur nec. Nulla imperdiet felis 
diam, tempor efficitur erat interdum consequat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac 
turpis egestas. Donec consectetur mi eget libero pharetra scelerisque volutpat cursus turpis. Vivamus sed sapien neque.'), 
		('Sickness and Health', '9780749313173', '2585871', '1984', '9', 'Nulla ut turpis ipsum. Duis tempor blandit est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue nisl est, 
eget vestibulum ipsum ultricies vitae. Curabitur ullamcorper, lorem at vestibulum efficitur, ipsum odio malesuada eros, nec 
dapibus augue massa mollis odio. Integer id scelerisque risus. Integer iaculis nibh eget enim porttitor, et lacinia elit bibendum. 
Morbi aliquet arcu in elit molestie, vel varius velit elementum. Maecenas molestie pretium euismod. Maecenas vel dui sit amet est 
accumsan maximus. Phasellus volutpat purus massa, eget varius mi iaculis sit amet. Ut mattis et arcu eget consectetur. Lorem 
ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lobortis massa ac fermentum ornare. Maecenas odio dolor, fermentum 
vel rutrum vitae, eleifend eget ex. Maecenas lectus risus, mollis non lorem eget, venenatis feugiat ante.

Nam aliquet, ligula eu luctus pretium, est velit ullamcorper eros, vitae molestie magna ex in mi. Nam vitae libero non turpis 
fringilla rhoncus quis in massa. Suspendisse ultricies justo et elit gravida, et feugiat tortor convallis. Proin maximus gravida nunc, 
sed vulputate ante porta et. Nam facilisis lacus urna, id mattis ligula hendrerit id. Curabitur vitae dictum diam. Morbi sit amet 
purus a eros fermentum mattis ullamcorper id orci. Quisque ultrices tempor metus. Donec at ante euismod, auctor felis sed, 
molestie nisi. Ut faucibus mattis tempus. Integer a lorem eleifend erat dapibus mattis. Nullam pharetra, justo quis venenatis 
mollis, erat neque ultrices magna, vel imperdiet lacus erat a tellus.');




