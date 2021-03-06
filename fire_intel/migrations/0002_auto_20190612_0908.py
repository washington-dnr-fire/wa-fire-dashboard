# Generated by Django 2.2.2 on 2019-06-12 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fire_intel', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='intelreport',
            name='preparedness_level_national',
            field=models.SmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], help_text="What's the national preparedness level? (out of 5)"),
        ),
        migrations.AlterField(
            model_name='intelreport',
            name='preparedness_level_nw',
            field=models.SmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], help_text="What's the curernt NW GACC preparedness level? (out of 5)"),
        ),
        migrations.AlterField(
            model_name='intelreport',
            name='type_1_teams_assigned',
            field=models.SmallIntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], help_text='How many out of the five Type 1 teams are currently assigned?'),
        ),
        migrations.AlterField(
            model_name='intelreport',
            name='type_2_teams_assigned',
            field=models.SmallIntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8)], help_text='How many out of the eight Type 2 teams are currently assigned?'),
        ),
    ]
