import argparse
import csv
import json
import os
import urllib


def is_float(x):
    try:
        a = float(x)
    except ValueError:
        return False
    else:
        return True


def is_int(x):
    try:
        a = float(x)
        b = int(a)
    except ValueError:
        return False
    else:
        return a == b


def convert(csv_file_path, json_file_name, fieldnames, json_fieldnames,
            position_fieldnames, mag_min, slice_size, empty_con, minify_json):
    csv_file = open(csv_file_path, 'r')

    reader = csv.DictReader(csv_file, fieldnames)
    valid_keynames = json_fieldnames.keys()

    output = []
    index = 0

    for row in reader:
        if reader.line_num == 1:
            continue

        formatted_row = {}

        for key in row.keys():
            val = row[key]

            if key in position_fieldnames:
                if not 'p' in formatted_row:
                    formatted_row['p'] = []
                formatted_row['p'].append(float(val))
                continue

            if not key in valid_keynames:
                continue

            renamed_key = json_fieldnames[key]

            if is_int(val):
                formatted_row[renamed_key] = int(float(val))
            elif is_float(val):
                formatted_row[renamed_key] = float(val)
            else:
                formatted_row[renamed_key] = row[key]

        if float(row['absmag']) >= mag_min and (empty_con or ['con'] != ''):
            output.append(formatted_row)

        if index % 500 == 0:
            print 'Processing ... @ index {}'.format(index)
        index += 1

    start = 0
    while start < len(output):
        end = start + slice_size
        sliced_output = output[start:end]

        json_file_path = '{}-{}-{}.json'.format(json_file_name, start, end)
        json_file = open(json_file_path, 'w')
        json.dump(sliced_output, json_file,
                  indent=(None if minify_json else 2),
                  sort_keys=True,
                  separators=(',', (':' if minify_json else ': ')))
        json_file.write('\n')
        json_file.close()

        file_size = os.path.getsize(json_file_path) / 1024
        print 'Saved {} stars in {} ({}kb)'.format(len(sliced_output),
                                                   json_file_path,
                                                   file_size)

        start += slice_size

    print 'Total {} stars saved.'.format(len(output))


def main():
    parser = argparse.ArgumentParser(
        description='Converts .csv HYG star database into sliced .json files.')
    parser.add_argument('--basedir', type=str, default='datasets',
                        help='Base folder of datasets')
    parser.add_argument('--source', type=str, default='hygdata-v3.csv',
                        help='Name of source file (.csv format)')
    parser.add_argument('--name', type=str, default='hygdata-v3',
                        help='Base name of .json output files')
    parser.add_argument('--mag_min', type=float, default=0.0,
                        help='Magnitude minimum filter')
    parser.add_argument('--slice_size', type=int, default=5000,
                        help='Maximum number of stars per .json file')
    parser.add_argument('--minify', type=bool, default=True,
                        help='Minify .json file output')
    parser.add_argument('--allow_empty', type=bool, default=False,
                        help='Allow stars with empty constellation name')
    parser.add_argument('--skip_download', type=bool, default=False,
                        help='Do not download dataset when not given')

    args = parser.parse_args()

    mag_min = args.mag_min
    slice_size = args.slice_size
    minify_json = args.minify
    allow_empty_constellation = args.allow_empty
    source_file_path = os.path.join(args.basedir, args.source)
    target_file_name = os.path.join(args.basedir, args.name)

    hyg_dataset_url = 'https://raw.githubusercontent.com/astronexus/HYG-Database/master/hygdata_v3.csv'

    hyg_fieldnames = ('id', 'hip', 'hd', 'hr', 'gl', 'bf', 'proper', 'ra',
                      'dec', 'dist', 'pmra', 'pmdec', 'rv', 'mag', 'absmag',
                      'spect', 'ci', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'rarad',
                      'decrad', 'pmrarad', 'pmdecrad', 'bayer', 'flam', 'con',
                      'comp', 'comp_primary', 'base', 'lum', 'var', 'var_min',
                      'var_max')

    hyg_json_fieldnames = {'con': 'c', 'id': 'id', 'absmag': 'm'}

    hyg_position_fieldnames = ('x', 'y', 'z')

    print '''Convert with options:

    Input file = {}
    Output file name = {}
    Magnitude minimum = {}
    Allow empty constellation names = {}
    Slize size = {}
    Minify json output = {}
        '''.format(source_file_path, target_file_name, mag_min,
                   allow_empty_constellation, slice_size, minify_json)

    if not os.path.isfile(source_file_path) and not args.skip_download:
        print 'Download dataset from {} ...'.format(hyg_dataset_url)
        urllib.urlretrieve(hyg_dataset_url, source_file_path)
        file_size = os.path.getsize(source_file_path) / 1024
        print 'Download finished ({}kb).'.format(file_size)

    convert(source_file_path, target_file_name, hyg_fieldnames,
            hyg_json_fieldnames, hyg_position_fieldnames,
            mag_min, slice_size, allow_empty_constellation, minify_json)

    print 'Done.'


if __name__ == '__main__':
    main()
