#!/usr/bin/python
#- * -coding: utf - 8 - * -

import urllib.request
import urllib.parse
import urllib.error


import requests
from bs4 import BeautifulSoup
from collections import Counter
from slugify import slugify
import ssl
import json
import re
import unidecode

import ast
import os
from urllib.request import Request, urlopen

with open('../spotify-data-fetcher/audio-features.json', 'r') as song_list:
  data = json.load(song_list)

bag_of_words_json = []

for song in data:
  artist_name = slugify(song['artistName']);
  song_name = song['name'].split("(", 1)[0]
  song_name = song_name.translate(str.maketrans({' ': '-', '\'': None, "(": None, ")": None, '’': None, "-": None}))
  url = "https://genius.com/{0}-{1}-lyrics".format(artist_name, slugify(song_name))

  print(url)
  # Request the inputted URL
  page = requests.get(url)

  # Creating a BeautifulSoup object of the html page for easy extraction of data.
  soup = BeautifulSoup(page.text, 'html.parser')
  html = soup.prettify('utf-8')

  # Objects for holding song data
  song['lyrics'] = [];

  #Extract the Lyrics of the song
  for div in soup.findAll('div', attrs = {'class': 'lyrics'}):
    lyrics = re.sub("[\(\[].*?[\)\]]", "", div.text).strip().split("\n");
    lyrics = list(filter(None, lyrics))
    song['lyrics'] = ' '.join(lyrics);

  if len(song['lyrics']) > 0:
    bag_of_words_json.append(song)

#Save the json created with the file name as title + .json
with open('features.json', 'w') as outfile:
  json.dump(bag_of_words_json, outfile, indent = 4, ensure_ascii = False)
